import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Heart, CheckCircle, Calendar, CreditCard, User, Phone, Mail } from "lucide-react";
import { submitDonation, DonationInput } from "../services/api";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AMOUNTS = [10000, 20000, 30000, 50000];

export default function DonationModal({ isOpen, onClose }: DonationModalProps) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    birthdate: "",
    amount: 10000,
    isCustomAmount: false,
    customAmount: "",
    payment_day: "5일",
    bank_name: "국민은행",
    account_number: "",
    account_holder: "",
    agreed: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errorMap: Record<string, string> = {};
    if (!formData.name.trim()) errorMap.name = "이름을 입력해주세요.";
    if (!formData.phone.trim()) {
      errorMap.phone = "연락처를 입력해주세요.";
    } else if (!/^\d{2,4}-?\d{3,4}-?\d{4}$/.test(formData.phone)) {
      errorMap.phone = "올바른 연락처 형식을 입력해주세요.";
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errorMap.email = "올바른 이메일 주소를 입력해주세요.";
    }
    if (!formData.birthdate.trim()) {
      errorMap.birthdate = "생년월일을 입력해주세요.";
    } else if (!/^\d{6,8}$/.test(formData.birthdate)) {
      errorMap.birthdate = "생년월일은 6자리 또는 8자리 숫자로 입력해주세요 (예: 900101).";
    }

    const donationAmt = formData.isCustomAmount 
      ? parseInt(formData.customAmount) 
      : formData.amount;
    
    if (isNaN(donationAmt) || donationAmt <= 0) {
      errorMap.amount = "올바른 후원 금액을 지정해주세요.";
    }

    if (!formData.account_number.trim()) {
      errorMap.account_number = "계좌번호를 입력해주세요.";
    }
    if (!formData.account_holder.trim()) {
      errorMap.account_holder = "예금주명을 입력해주세요.";
    }
    if (!formData.agreed) {
      errorMap.agreed = "개인정보 수집 및 금융거래 정보제공 동의가 필요합니다.";
    }

    setErrors(errorMap);
    return Object.keys(errorMap).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const finalAmount = formData.isCustomAmount 
      ? parseInt(formData.customAmount) 
      : formData.amount;

    const inputData: DonationInput = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      birthdate: formData.birthdate,
      amount: finalAmount,
      payment_day: formData.payment_day,
      bank_name: formData.bank_name,
      account_number: formData.account_number,
      account_holder: formData.account_holder,
    };

    try {
      await submitDonation(inputData);
      setStep("success");
    } catch (err) {
      console.error("Submission failed", err);
      alert("신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  const handleClose = () => {
    setStep("form");
    setFormData({
      name: "",
      phone: "",
      email: "",
      birthdate: "",
      amount: 10000,
      isCustomAmount: false,
      customAmount: "",
      payment_day: "5일",
      bank_name: "국민은행",
      account_number: "",
      account_holder: "",
      agreed: false,
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-pink-150 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary fill-primary" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">정기후원 신청 (인적사항 기록)</h2>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form / Success Content scrolling */}
          <div className="p-8 overflow-y-auto flex-1">
            {step === "form" ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">1. 후원자 인적사항</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        성명 (실명) <span className="text-primary">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-3.5 text-gray-400">
                          <User className="w-4 h-4" />
                        </span>
                        <input
                          type="text"
                          placeholder="홍길동"
                          value={formData.name}
                          onChange={(e) => {
                            setFormData({ 
                              ...formData, 
                              name: e.target.value,
                              account_holder: formData.account_holder === "" || formData.account_holder === formData.name ? e.target.value : formData.account_holder
                            });
                          }}
                          className={`w-full pl-9 pr-4 py-2.5 border rounded-xl outline-none transition-all ${
                            errors.name ? "border-red-500 focus:ring-red-100" : "border-gray-200 focus:ring-pink-100 focus:border-primary"
                          }`}
                        />
                      </div>
                      {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        휴대폰 번호 <span className="text-primary">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-3.5 text-gray-400">
                          <Phone className="w-4 h-4" />
                        </span>
                        <input
                          type="text"
                          placeholder="010-0000-0000"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className={`w-full pl-9 pr-4 py-2.5 border rounded-xl outline-none transition-all ${
                            errors.phone ? "border-red-500 focus:ring-red-100" : "border-gray-200 focus:ring-pink-100 focus:border-primary"
                          }`}
                        />
                      </div>
                      {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">이메일 주소</label>
                      <div className="relative">
                        <span className="absolute left-3 top-3.5 text-gray-400">
                          <Mail className="w-4 h-4" />
                        </span>
                        <input
                          type="email"
                          placeholder="example@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={`w-full pl-9 pr-4 py-2.5 border rounded-xl outline-none transition-all ${
                            errors.email ? "border-red-500 focus:ring-red-100" : "border-gray-200 focus:ring-pink-100 focus:border-primary"
                          }`}
                        />
                      </div>
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        생년월일 (6자리 또는 8자리) <span className="text-primary">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-3.5 text-gray-400">
                          <Calendar className="w-4 h-4" />
                        </span>
                        <input
                          type="text"
                          placeholder="예: 900101"
                          maxLength={8}
                          value={formData.birthdate}
                          onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                          className={`w-full pl-9 pr-4 py-2.5 border rounded-xl outline-none transition-all ${
                            errors.birthdate ? "border-red-500 focus:ring-red-100" : "border-gray-200 focus:ring-pink-100 focus:border-primary"
                          }`}
                        />
                      </div>
                      {errors.birthdate && <p className="text-xs text-red-500 mt-1">{errors.birthdate}</p>}
                    </div>
                  </div>
                </div>

                <hr className="border-gray-100" />

                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">2. 정기 후원 정보</h3>
                  
                  {/* Amount Presets */}
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-gray-700 mb-2">매월 후원할 금액</label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {PRESET_AMOUNTS.map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setFormData({ ...formData, isCustomAmount: false, amount: amt })}
                          className={`py-2 px-3 rounded-xl border text-sm font-bold transition-all ${
                            !formData.isCustomAmount && formData.amount === amt
                              ? "bg-primary border-primary text-white shadow-md shadow-pink-100"
                              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {amt.toLocaleString()}원
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, isCustomAmount: true })}
                        className={`py-2 px-3 rounded-xl border text-sm font-bold transition-all ${
                          formData.isCustomAmount
                            ? "bg-primary border-primary text-white shadow-md shadow-pink-100"
                            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        직접 입력
                      </button>
                    </div>

                    {formData.isCustomAmount && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-3"
                      >
                        <div className="relative">
                          <input
                            type="number"
                            placeholder="원하는 납부 금액을 입력해주세요."
                            value={formData.customAmount}
                            onChange={(e) => setFormData({ ...formData, customAmount: e.target.value })}
                            className="w-full pr-12 pl-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold"
                          />
                          <span className="absolute right-4 top-3 text-sm font-bold text-gray-400">원 / 월</span>
                        </div>
                      </motion.div>
                    )}
                    {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
                  </div>

                  {/* Payment Day Selector */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">희망 출금일</label>
                    <div className="flex gap-2">
                      {["5일", "15일", "25일"].map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => setFormData({ ...formData, payment_day: day })}
                          className={`flex-1 py-2 px-3 rounded-xl border text-sm font-semibold transition-all ${
                            formData.payment_day === day
                              ? "bg-gray-900 border-gray-900 text-white"
                              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          매월 {day}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <hr className="border-gray-100" />

                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">3. 출금 계좌 정보 (자동이체 등록)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        출금 은행 <span className="text-primary">*</span>
                      </label>
                      <select
                        value={formData.bank_name}
                        onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium"
                      >
                        {["국민은행", "신한은행", "하나은행", "우리은행", "농협은행", "기업은행", "카카오뱅크", "토스뱅크", "신협", "새마을금고"].map((bank) => (
                          <option key={bank} value={bank}>{bank}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        계좌번호 <span className="text-primary">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-3.5 text-gray-400">
                          <CreditCard className="w-4 h-4" />
                        </span>
                        <input
                          type="text"
                          placeholder="'-' 구분없이 숫자만 입력"
                          value={formData.account_number}
                          onChange={(e) => setFormData({ ...formData, account_number: e.target.value.replace(/[^0-9]/g, "") })}
                          className={`w-full pl-9 pr-4 py-2.5 border rounded-xl outline-none transition-all ${
                            errors.account_number ? "border-red-500 focus:ring-red-100" : "border-gray-200 focus:ring-pink-100 focus:border-primary"
                          }`}
                        />
                      </div>
                      {errors.account_number && <p className="text-xs text-red-500 mt-1">{errors.account_number}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        예금주명 <span className="text-primary">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="예금주 성명"
                        value={formData.account_holder}
                        onChange={(e) => setFormData({ ...formData, account_holder: e.target.value })}
                        className={`w-full px-4 py-2.5 border rounded-xl outline-none transition-all ${
                          errors.account_holder ? "border-red-500 focus:ring-red-100" : "border-gray-200 focus:ring-pink-100 focus:border-primary"
                        }`}
                      />
                      {errors.account_holder && <p className="text-xs text-red-500 mt-1">{errors.account_holder}</p>}
                    </div>
                  </div>
                </div>

                <hr className="border-gray-100" />

                <div className="bg-gray-50 p-4 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <input
                      id="agree-checkbox"
                      type="checkbox"
                      checked={formData.agreed}
                      onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                      className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <label htmlFor="agree-checkbox" className="text-xs text-gray-600 leading-relaxed cursor-pointer select-none">
                      <span className="font-bold text-gray-800">[필수] 개인정보 수집·이용 및 금융거래 정보 제공 동의</span>
                      <br />
                      사단법인 마음지키미는 관련 법률에 의거하여 후원금 출금 등록 및 기부금 영수증 발행의 목적을 위해 후원자님의 개인정보 및 금융정보를 안전하게 수집 및 보관합니다.
                    </label>
                  </div>
                  {errors.agreed && <p className="text-xs text-red-500 mt-2 font-semibold">{errors.agreed}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors shadow-lg shadow-pink-100"
                >
                  <Heart className="w-5 h-5 fill-white" /> 정기 후원 신청 완료하기
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-6"
              >
                <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle className="w-12 h-12 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900">정기 후원 신청 완료!</h3>
                  <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                    사단법인 마음지키미의 소중한 동반자가 되어주셔서 진심으로 감사드립니다. 등록해주신 인적정보와 금융정보로 자동이체가 안전하게 등록되었습니다.
                  </p>
                </div>
                <div className="bg-pink-50/50 p-6 rounded-2xl max-w-md mx-auto border border-pink-100/30 text-left space-y-2 text-sm">
                  <p className="text-gray-700 font-semibold text-center mb-2 border-b border-pink-100/50 pb-2">신청 요약 정보</p>
                  <p className="text-gray-600"><span className="font-bold text-gray-700">후원자 성명:</span> {formData.name}</p>
                  <p className="text-gray-600"><span className="font-bold text-gray-700">매월 후원금:</span> {(formData.isCustomAmount ? parseInt(formData.customAmount) : formData.amount).toLocaleString()}원 / 월</p>
                  <p className="text-gray-600"><span className="font-bold text-gray-700">희망 출금일:</span> 매월 {formData.payment_day}</p>
                  <p className="text-gray-600"><span className="font-bold text-gray-700">은행 및 계좌:</span> {formData.bank_name} (****{formData.account_number.slice(-4)})</p>
                </div>
                <button
                  onClick={handleClose}
                  className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
                >
                  확인
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
