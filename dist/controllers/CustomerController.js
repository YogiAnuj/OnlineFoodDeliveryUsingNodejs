"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditCustomerProfile = exports.GetCustomerProfile = exports.RequestOTP = exports.CustomerLogin = exports.CustomerVerify = exports.CustomerSignUp = void 0;
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var dto_1 = require("../dto");
var utility_1 = require("../utility");
var Customer_1 = require("../models/Customer");
var SignatureUtility_1 = require("../utility/SignatureUtility");
var CustomerSignUp = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerInput, inputErrors, password, phone, email, checkCustomer, salt, userPassword, _a, otp, expiry, result, signature;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                customerInput = class_transformer_1.plainToClass(dto_1.CreateCustomerInput, req.body);
                return [4 /*yield*/, class_validator_1.validate(customerInput, {
                        validationError: { target: false },
                    })];
            case 1:
                inputErrors = _b.sent();
                if (inputErrors.length > 0) {
                    return [2 /*return*/, res.status(400).json(inputErrors)];
                }
                password = customerInput.password, phone = customerInput.phone, email = customerInput.email;
                return [4 /*yield*/, Customer_1.Customer.findOne({ phone: phone })];
            case 2:
                checkCustomer = _b.sent();
                if (checkCustomer !== null) {
                    return [2 /*return*/, res.status(401).json({ message: "Customer already exists." })];
                }
                return [4 /*yield*/, utility_1.GenerateSalt()];
            case 3:
                salt = _b.sent();
                return [4 /*yield*/, utility_1.GeneratePassword(password, salt)];
            case 4:
                userPassword = _b.sent();
                return [4 /*yield*/, utility_1.GenerateOTP()];
            case 5:
                _a = _b.sent(), otp = _a.otp, expiry = _a.expiry;
                return [4 /*yield*/, Customer_1.Customer.create({
                        email: email,
                        phone: phone,
                        password: userPassword,
                        salt: salt,
                        otp: otp,
                        otp_expiry: expiry,
                        firstName: "",
                        lastName: "",
                        lat: 0,
                        lng: 0,
                        verified: false,
                    })];
            case 6:
                result = _b.sent();
                if (!result) return [3 /*break*/, 9];
                // send OTP to the customer
                return [4 /*yield*/, utility_1.onRequestOTP(otp, phone)];
            case 7:
                // send OTP to the customer
                _b.sent();
                return [4 /*yield*/, SignatureUtility_1.GenerateSignature({
                        _id: result.id,
                        email: result.email,
                        verified: result.verified,
                    })];
            case 8:
                signature = _b.sent();
                // send the result to the client
                return [2 /*return*/, res.json({
                        signature: signature,
                        email: result.email,
                        verified: result.verified,
                    })];
            case 9: return [2 /*return*/, res.status(500).json({ message: "Something went wrong." })];
        }
    });
}); };
exports.CustomerSignUp = CustomerSignUp;
var CustomerVerify = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var otp, customer, profile, updatedProfile, signature;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                otp = req.body.otp;
                customer = req.user;
                if (!customer) return [3 /*break*/, 5];
                return [4 /*yield*/, Customer_1.Customer.findById(customer._id)];
            case 1:
                profile = _a.sent();
                if (!(profile &&
                    profile.otp === parseInt(otp) &&
                    profile.otp_expiry >= new Date())) return [3 /*break*/, 4];
                profile.verified = true;
                return [4 /*yield*/, profile.save()];
            case 2:
                updatedProfile = _a.sent();
                return [4 /*yield*/, SignatureUtility_1.GenerateSignature({
                        _id: updatedProfile.id,
                        email: updatedProfile.email,
                        verified: updatedProfile.verified,
                    })];
            case 3:
                signature = _a.sent();
                return [2 /*return*/, res.json({
                        signature: signature,
                        email: updatedProfile.email,
                        verified: updatedProfile.verified,
                    })];
            case 4: return [2 /*return*/, res.status(401).json({ message: "OTP expired." })];
            case 5: return [2 /*return*/, res
                    .status(500)
                    .json({ message: "Something went wrong while otp validation." })];
        }
    });
}); };
exports.CustomerVerify = CustomerVerify;
var CustomerLogin = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var loginInputs, inputErrors, phone, password, customer, validation, signature;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                loginInputs = class_transformer_1.plainToClass(dto_1.CustomerLoginInputs, req.body);
                return [4 /*yield*/, class_validator_1.validate(loginInputs, {
                        validationError: { target: true },
                    })];
            case 1:
                inputErrors = _a.sent();
                if (inputErrors.length > 0) {
                    return [2 /*return*/, res.status(400).json(inputErrors)];
                }
                phone = loginInputs.phone, password = loginInputs.password;
                return [4 /*yield*/, Customer_1.Customer.findOne({ phone: phone })];
            case 2:
                customer = _a.sent();
                if (!(customer !== null)) return [3 /*break*/, 6];
                return [4 /*yield*/, utility_1.comparePassword(password, customer.password)];
            case 3:
                validation = _a.sent();
                if (!validation) return [3 /*break*/, 5];
                return [4 /*yield*/, SignatureUtility_1.GenerateSignature({
                        _id: customer.id,
                        email: customer.email,
                        verified: customer.verified,
                    })];
            case 4:
                signature = _a.sent();
                // send the customer to the client
                return [2 /*return*/, res.json({
                        signature: signature,
                        email: customer.email,
                        verified: customer.verified,
                    })];
            case 5: return [2 /*return*/, res.status(401).json({ message: "Incorrect password." })];
            case 6: return [2 /*return*/, res.status(401).json({ message: "Invalid phone number." })];
        }
    });
}); };
exports.CustomerLogin = CustomerLogin;
var RequestOTP = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, profile, _a, otp, expiry;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                customer = req.user;
                if (!customer) return [3 /*break*/, 5];
                return [4 /*yield*/, Customer_1.Customer.findById(customer === null || customer === void 0 ? void 0 : customer._id)];
            case 1:
                profile = _b.sent();
                if (!profile) return [3 /*break*/, 5];
                return [4 /*yield*/, utility_1.GenerateOTP()];
            case 2:
                _a = _b.sent(), otp = _a.otp, expiry = _a.expiry;
                return [4 /*yield*/, utility_1.onRequestOTP(otp, profile === null || profile === void 0 ? void 0 : profile.phone)];
            case 3:
                _b.sent();
                profile.otp = otp;
                profile.otp_expiry = expiry;
                return [4 /*yield*/, profile.save()];
            case 4:
                _b.sent();
                return [2 /*return*/, res.json({ message: "OTP sent to the registered phone number." })];
            case 5: return [2 /*return*/, res
                    .status(500)
                    .json({ message: "Something went wrong in request otp" })];
        }
    });
}); };
exports.RequestOTP = RequestOTP;
var GetCustomerProfile = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, profile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                customer = req.user;
                if (!customer) return [3 /*break*/, 2];
                return [4 /*yield*/, Customer_1.Customer.findById(customer === null || customer === void 0 ? void 0 : customer._id)];
            case 1:
                profile = _a.sent();
                if (profile) {
                    return [2 /*return*/, res.json(profile)];
                }
                _a.label = 2;
            case 2: return [2 /*return*/, res
                    .status(500)
                    .json({ message: "Something went wrong in request otp" })];
        }
    });
}); };
exports.GetCustomerProfile = GetCustomerProfile;
var EditCustomerProfile = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, profileInput, inputErrors, firstName, lastName, address, profile, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                customer = req.user;
                if (!customer) return [3 /*break*/, 5];
                profileInput = class_transformer_1.plainToClass(dto_1.EditCustomerProfileInput, req.body);
                return [4 /*yield*/, class_validator_1.validate(profileInput, {
                        validationError: { target: false },
                    })];
            case 1:
                inputErrors = _a.sent();
                if (inputErrors.length > 0) {
                    return [2 /*return*/, res.status(400).json(inputErrors)];
                }
                firstName = profileInput.firstName, lastName = profileInput.lastName, address = profileInput.address;
                return [4 /*yield*/, Customer_1.Customer.findById(customer._id)];
            case 2:
                profile = _a.sent();
                if (!profile) return [3 /*break*/, 4];
                profile.firstName = firstName;
                profile.lastName = lastName;
                profile.address = address;
                return [4 /*yield*/, profile.save()];
            case 3:
                result = _a.sent();
                return [2 /*return*/, res.json(result)];
            case 4: return [2 /*return*/, res.status(400).json({ message: "Profile not found." })];
            case 5: return [2 /*return*/, res
                    .status(500)
                    .json({ message: "Something went wrong in request otp" })];
        }
    });
}); };
exports.EditCustomerProfile = EditCustomerProfile;
//# sourceMappingURL=CustomerController.js.map