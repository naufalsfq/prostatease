"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Info, FileText, Download, Home, Save, CheckCircle } from 'lucide-react';

const ipssQuestions = [
  {
    id: 'q1',
    question: 'Seberapa sering Anda merasa masih ada sisa setelah selesai buang air kecil?',
    tooltip: 'Incomplete emptying: Sensasi bahwa kandung kemih tidak kosong sepenuhnya setelah berkemih',
  },
  {
    id: 'q2',
    question: 'Seberapa sering Anda harus kembali kencing dalam waktu kurang dari 2 jam setelah selesai kencing?',
    tooltip: 'Frequency: Frekuensi berkemih yang meningkat, biasanya lebih dari 8 kali dalam 24 jam',
  },
  {
    id: 'q3',
    question: 'Seberapa sering Anda mendapatkan bahwa Anda berhenti dan mulai lagi beberapa kali ketika Anda kencing?',
    tooltip: 'Intermittency: Aliran urin yang tidak kontinyu, berhenti dan mulai kembali selama proses berkemih',
  },
  {
    id: 'q4',
    question: 'Seberapa sering Anda merasa sulit untuk menahan kencing Anda?',
    tooltip: 'Urgency: Dorongan mendadak yang kuat dan sulit ditahan untuk segera berkemih',
  },
  {
    id: 'q5',
    question: 'Seberapa sering pancaran kencing Anda lemah?',
    tooltip: 'Weak stream: Pancaran urin yang berkurang kekuatannya dibandingkan kondisi normal',
  },
  {
    id: 'q6',
    question: 'Seberapa sering Anda harus mengejan untuk mulai kencing?',
    tooltip: 'Straining: Perlu mengejan atau mendorong untuk memulai atau mempertahankan aliran urin',
  },
  {
    id: 'q7',
    question: 'Seberapa sering Anda harus bangun untuk kencing, sejak mulai tidur pada malam hari hingga bangun di pagi hari?',
    tooltip: 'Nocturia: Terbangun pada malam hari untuk berkemih, mengganggu kualitas tidur',
  },
];

const answerOptions = [
  { value: 0, label: 'Tidak Pernah' },
  { value: 1, label: 'Kurang dari 1 dalam 5 kali' },
  { value: 2, label: 'Kurang dari setengah waktu' },
  { value: 3, label: 'Kira-kira setengah waktu' },
  { value: 4, label: 'Lebih dari setengah waktu' },
  { value: 5, label: 'Hampir selalu' },
];

const nocturiaOptions = [
  { value: 0, label: 'Tidak pernah' },
  { value: 1, label: '1 kali' },
  { value: 2, label: '2 kali' },
  { value: 3, label: '3 kali' },
  { value: 4, label: '4 kali' },
  { value: 5, label: '5 kali atau lebih' },
];

const qolOptions = [
  { value: 0, label: 'Senang sekali' },
  { value: 1, label: 'Senang' },
  { value: 2, label: 'Pada umumnya puas' },
  { value: 3, label: 'Campur antara puas dan tidak puas' },
  { value: 4, label: 'Pada umumnya tidak puas' },
  { value: 5, label: 'Tidak senang' },
  { value: 6, label: 'Buruk sekali' },
];

export default function IPSSForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  // State untuk menyimpan jawaban
  const [answers, setAnswers] = useState<Record<string, number | null>>({
    q1: null, q2: null, q3: null, q4: null, q5: null, q6: null, q7: null, qol: null
  });
  const [showTooltip, setShowTooltip] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const totalSteps = 8;
  const isLastStep = currentStep === totalSteps - 1;
  const currentQuestion = currentStep < 7 ? ipssQuestions[currentStep] : null;

  const handleAnswer = (value: number) => {
    const key = currentStep < 7 ? `q${currentStep + 1}` : 'qol';
    setAnswers({ ...answers, [key]: value });
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      setShowTooltip(false);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowTooltip(false);
    }
  };

  const calculateScore = () => {
    // Hitung total skor dari q1 sampai q7
    let total = 0;
    for (let i = 1; i <= 7; i++) {
      total += (answers[`q${i}`] || 0);
    }
    return total;
  };

  const getCategory = (score: number) => {
    if (score <= 7) return { name: 'Ringan', color: 'green', bgColor: 'bg-green-50', borderColor: 'border-green-500', textColor: 'text-green-700' };
    if (score <= 19) return { name: 'Sedang', color: 'yellow', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-500', textColor: 'text-yellow-700' };
    return { name: 'Berat', color: 'red', bgColor: 'bg-red-50', borderColor: 'border-red-500', textColor: 'text-red-700' };
  };

  const handleSubmit = () => {
    const allAnswered = Object.values(answers).every(val => val !== null);
    if (!allAnswered) {
      alert('Mohon jawab semua pertanyaan terlebih dahulu');
      return;
    }

    setIsSaving(true);

    // --- SIMULASI PENYIMPANAN KE LOCALSTORAGE ---
    setTimeout(() => {
      const score = calculateScore();
      const category = getCategory(score).name;
      const newAssessment = {
        id: Date.now(), // ID unik berdasarkan waktu
        date: new Date().toISOString(),
        totalScore: score,
        qol: answers.qol,
        category: category
      };

      // Ambil data lama, tambahkan data baru, simpan lagi
      const existingData = JSON.parse(localStorage.getItem('assessments') || '[]');
      existingData.push(newAssessment);
      localStorage.setItem('assessments', JSON.stringify(existingData));

      setIsSaving(false);
      setShowResults(true);
    }, 1000);
  };

  // --- TAMPILAN HASIL ---
  if (showResults) {
    const score = calculateScore();
    const category = getCategory(score);
    const qolScore = answers.qol ?? 0;

    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-blue-600 p-6 text-center text-white">
            <CheckCircle className="mx-auto h-12 w-12 mb-2 text-blue-200" />
            <h1 className="text-3xl font-bold">Hasil Asesmen Selesai</h1>
            <p className="text-blue-100">Data Anda telah disimpan secara lokal.</p>
          </div>

          <div className="p-8">
            {/* Kartu Skor */}
            <div className={`${category.bgColor} border-2 ${category.borderColor} rounded-xl p-6 mb-8 text-center`}>
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-600 mb-1">Total Skor IPSS</p>
              <div className="text-5xl font-bold text-gray-900 mb-2">{score}</div>
              <div className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${category.bgColor} ${category.textColor} border ${category.borderColor}`}>
                Kategori: {category.name}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Skor Kualitas Hidup</p>
                <p className="text-2xl font-bold text-gray-800">{qolScore} <span className="text-sm font-normal text-gray-500">/ 6</span></p>
                <p className="text-xs text-gray-500 mt-1">
                  (0 = Sangat Senang, 6 = Sangat Buruk)
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Tanggal Asesmen</p>
                <p className="text-lg font-semibold text-gray-800">
                  {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => router.push('/dashboard')}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
              >
                <Home className="mr-2 h-5 w-5" /> Kembali ke Dashboard
              </button>
              
              <button 
                onClick={() => {
                  setShowResults(false);
                  setCurrentStep(0);
                  setAnswers({ q1: null, q2: null, q3: null, q4: null, q5: null, q6: null, q7: null, qol: null });
                }}
                className="w-full py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Isi Ulang Asesmen
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- TAMPILAN PERTANYAAN ---
  const currentAnswer = currentStep < 7 
    ? answers[`q${currentStep + 1}`] 
    : answers.qol;

  const currentOptions = currentStep === 6 ? nocturiaOptions : (currentStep === 7 ? qolOptions : answerOptions);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
            <span>Pertanyaan {currentStep + 1} dari {totalSteps}</span>
            <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Card Pertanyaan */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            {currentStep < 7 ? (
              <>
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-900">{currentQuestion?.question}</h2>
                  <button onClick={() => setShowTooltip(!showTooltip)} className="text-blue-500 hover:text-blue-700">
                    <Info size={24} />
                  </button>
                </div>
                {showTooltip && (
                  <div className="mb-6 bg-blue-50 p-3 rounded-lg text-sm text-blue-800 border border-blue-100">
                    {currentQuestion?.tooltip}
                  </div>
                )}
              </>
            ) : (
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Jika Anda harus menghabiskan sisa hidup dengan kondisi berkemih seperti sekarang, bagaimana perasaan Anda?
              </h2>
            )}

            {/* Pilihan Jawaban */}
            <div className="space-y-3">
              {currentOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleAnswer(opt.value)}
                  className={`w-full p-4 text-left border rounded-xl transition-all flex justify-between items-center ${
                    currentAnswer === opt.value
                      ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span className={`font-medium ${currentAnswer === opt.value ? 'text-blue-700' : 'text-gray-700'}`}>
                    {opt.label}
                  </span>
                  {currentAnswer === opt.value && <CheckCircle className="h-5 w-5 text-blue-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Navigasi */}
          <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-between">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <ChevronLeft className="h-5 w-5 mr-1" /> Sebelumnya
            </button>

            {isLastStep ? (
              <button
                onClick={handleSubmit}
                disabled={currentAnswer === null || isSaving}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-bold shadow-md transition-transform active:scale-95"
              >
                {isSaving ? 'Menyimpan...' : 'Lihat Hasil'} <FileText className="h-5 w-5 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={currentAnswer === null}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-bold shadow-md transition-transform active:scale-95"
              >
                Selanjutnya <ChevronRight className="h-5 w-5 ml-1" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}