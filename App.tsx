// Type definitions for the Web Speech API.
interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
    readonly isFinal: boolean;
    readonly length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
}

interface SpeechRecognitionStatic {
    new (): SpeechRecognition;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: (event: SpeechRecognitionEvent) => void;
    start(): void;
    stop(): void;
}

declare global {
    interface Window {
        SpeechRecognition: SpeechRecognitionStatic;
        webkitSpeechRecognition: SpeechRecognitionStatic;
    }
}


import React, { useState, useCallback, useEffect, useRef } from 'react';
import { analyzePlantHealth } from './public/geminiService.ts';
import { AppStatus } from './types.ts';
import type { PlantAnalysis, LanguageCode } from './types.ts';
import { Camera, CheckCircle, ChevronLeft, ChevronRight, FileUp, Mic, Upload, XCircle, Zap, Leaf, RefreshCw, ZoomIn, ZoomOut, Maximize, X, RotateCcw, Download, Users, ExternalLink } from 'lucide-react';

const supportedLanguages: { code: LanguageCode; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'sw', name: 'Kiswahili' },
  { code: 'fr', name: 'Français' },
  { code: 'ar', name: 'العربية' },
  { code: 'de', name: 'Deutsch' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'es', name: 'Español' },
  { code: 'it', name: 'Italiano' },
];

const translations = {
  en: {
    title: "Plant Doctor AI",
    subtitle: "Your personal botanist for a thriving garden.",
    getStarted: "Get Started",
    heroParagraph: "Snap a photo of your plant, describe its symptoms with your voice, and get an instant AI-powered diagnosis and treatment plan.",
    feature1Title: "Snap & Identify",
    feature1Desc: "Use your camera or upload a photo for instant analysis.",
    feature2Title: "Instant Diagnosis",
    feature2Desc: "Our AI identifies diseases and provides expert solutions.",
    feature3Title: "Voice Notes",
    feature3Desc: "Add context by describing what you see for a more accurate result.",
    back: "Back",
    step1Title: "Step 1: Provide an Image",
    uploaderLabel: "Drag & drop or click to upload",
    uploaderHint: "PNG, JPG, or WEBP",
    cameraLabel: "Open Camera",
    fileLabel: "Choose File",
    capturePhoto: "Capture Photo",
    switchCamera: "Switch Camera",
    step2Title: "Step 2: Describe Symptoms",
    step2Desc: "Describe what you see. E.g., 'Yellow spots on lower leaves.'",
    textAreaPlaceholder: "Type or record...",
    analyzePlant: "Analyze Plant",
    loading_preparing: "Preparing data...",
    loading_processing: "Processing image...",
    loading_consulting: "Consulting AI...",
    loading_finalizing: "Finalizing...",
    confidence: "Confidence",
    description: "Description",
    treatmentPlan: "Treatment Plan",
    preventionTips: "Prevention Tips",
    analyzeAnother: "Analyze Another",
    disclaimer: "Informational only. Not a substitute for professional advice.",
    errorTitle: "Analysis Failed",
    tryAgain: "Try Again",
    healthy: "Healthy",
    adTitle: 'Upgrade Your Tools!',
    adDescription: '20% off premium gardening toolsets.',
    adCta: 'Shop Now',
    adClose: 'Close',
    adLabel: 'Ad',
    clickToZoom: "Click to zoom",
    zoomIn: "Zoom In",
    zoomOut: "Zoom Out",
    resetZoom: "Reset",
    close: "Close",
    install: "Install App",
    community: "Community Forum",
    communityDesc: "Connect with fellow gardeners and plant experts for more advice.",
    visitCommunity: "Visit Community"
  },
  sw: { title: "Daktari wa Mimea", subtitle: "Mtaalamu wako wa bustani.", getStarted: "Anza", heroParagraph: "Piga picha ya mmea, elezea dalili kwa sauti.", feature1Title: "Piga Picha", feature1Desc: "Tumia kamera au pakia picha.", feature2Title: "Utambuzi", feature2Desc: "AI inatambua magonjwa.", feature3Title: "Sauti", feature3Desc: "Ongeza maelezo ya sauti.", back: "Rudi", step1Title: "Hatua 1: Picha", uploaderLabel: "Pakia picha hapa", uploaderHint: "PNG, JPG", cameraLabel: "Kamera", fileLabel: "Faili", capturePhoto: "Piga", switchCamera: "Badili", step2Title: "Hatua 2: Dalili", step2Desc: "Elezea unachoona.", textAreaPlaceholder: "Andika...", analyzePlant: "Changanua", loading_preparing: "Inatayarisha...", loading_processing: "Inachakata...", loading_consulting: "Inashauriana...", loading_finalizing: "Inakamilisha...", confidence: "Uhakika", description: "Maelezo", treatmentPlan: "Matibabu", preventionTips: "Kinga", analyzeAnother: "Mwingine", disclaimer: "Kwa habari tu.", errorTitle: "Imeshindwa", tryAgain: "Tena", healthy: "Mzima", adTitle: "Vifaa", adDescription: "Punguzo 20%", adCta: "Nunua", adClose: "Funga", adLabel: "Ad", clickToZoom: "Kuzidisha", zoomIn: "Kuza", zoomOut: "Punguza", resetZoom: "Rudisha", close: "Funga", install: "Weka Programu", community: "Jukwaa la Jamii", communityDesc: "Ungana na wakulima wengine na wataalam wa mimea kwa ushauri zaidi.", visitCommunity: "Tembelea Jamii" },
  fr: { title: "Docteur des Plantes", subtitle: "Votre botaniste personnel.", getStarted: "Commencer", heroParagraph: "Prenez une photo, décrivez les symptômes par la voix.", feature1Title: "Photographier", feature1Desc: "Utilisez la caméra ou téléchargez une photo.", feature2Title: "Diagnostic", feature2Desc: "L'IA identifie les maladies.", feature3Title: "Voix", feature3Desc: "Ajoutez des notes vocales.", back: "Retour", step1Title: "Étape 1 : Image", uploaderLabel: "Glissez-déposez ici", uploaderHint: "PNG, JPG", cameraLabel: "Caméra", fileLabel: "Fichier", capturePhoto: "Capturer", switchCamera: "Changer", step2Title: "Étape 2 : Symptômes", step2Desc: "Décrivez ce que vous voyez.", textAreaPlaceholder: "Écrivez ici...", analyzePlant: "Analyser", loading_preparing: "Préparation...", loading_processing: "Traitement...", loading_consulting: "Consultation...", loading_finalizing: "Finalisation...", confidence: "Confiance", description: "Description", treatmentPlan: "Traitement", preventionTips: "Prévention", analyzeAnother: "Un autre", disclaimer: "Informations uniquement.", errorTitle: "Échec", tryAgain: "Réessayer", healthy: "Sain", adTitle: "Outils", adDescription: "-20% sur les outils.", adCta: "Acheter", adClose: "Fermer", adLabel: "Pub", clickToZoom: "Zoomer", zoomIn: "Zoomer", zoomOut: "Dézoomer", resetZoom: "Réinitialiser", close: "Fermer", install: "Installer l'app", community: "Forum de la communauté", communityDesc: "Connectez-vous avec d'autres jardiniers et experts.", visitCommunity: "Visiter la communauté" },
};

const fileToBase64 = (file: File): Promise<{ base64: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const [mime, data] = result.split(',');
      if (!mime || !data) { reject(new Error("Invalid file format.")); return; }
      resolve({ base64: data, mimeType: mime.split(':')[1].split(';')[0] });
    };
    reader.onerror = (error) => reject(error);
  });
};

const Header: React.FC<{ t: (key: string) => string, language: LanguageCode, setLanguage: (lang: LanguageCode) => void, installPrompt: any, onInstall: () => void }> = ({ t, language, setLanguage, installPrompt, onInstall }) => (
    <header className="p-4 text-center sticky top-0 bg-brand-gray-light/80 backdrop-blur-md z-30">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
            <h1 className="text-3xl font-bold text-brand-green-dark tracking-tight flex items-center justify-center gap-2">
                <Leaf className="w-8 h-8 text-brand-green" /> {t('title')}
            </h1>
            
            <div className="flex justify-center items-center flex-wrap gap-4 mt-4">
                <div className="flex gap-2">
                  {supportedLanguages.map(lang => (
                      <button 
                          key={lang.code}
                          onClick={() => setLanguage(lang.code)} 
                          className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${language === lang.code ? 'bg-brand-green text-white shadow-lg scale-110' : 'bg-white text-brand-gray-dark hover:bg-gray-100'}`}
                      >
                          {lang.name}
                      </button>
                  ))}
                </div>

                <a 
                  href="https://community.plantdoctor.ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-bold text-brand-green-dark hover:text-brand-green transition-colors px-3 py-1 bg-white rounded-full shadow-sm"
                >
                  <Users className="w-4 h-4" /> {t('community')}
                </a>
            </div>

            {installPrompt && (
                <button 
                    onClick={onInstall}
                    className="mt-4 flex items-center gap-2 px-4 py-2 bg-brand-green text-white text-xs font-bold rounded-full shadow-lg hover:bg-brand-green-dark transition-all"
                >
                    <Download className="w-4 h-4" /> {t('install')}
                </button>
            )}
        </div>
    </header>
);

const CameraCapture: React.FC<{ onCapture: (file: File) => void, t: (key: string) => string }> = ({ onCapture, t }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const startStream = async () => {
        try {
            setError(null);
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode, width: { ideal: 1080 }, height: { ideal: 1080 } }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsStreaming(true);
            }
        } catch (err) {
            setError("Camera access denied or unavailable.");
        }
    };

    const stopStream = () => {
        if (videoRef.current?.srcObject) {
            (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
            setIsStreaming(false);
        }
    };

    const capture = () => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
            canvas.toBlob((blob) => {
                if (blob) {
                    onCapture(new File([blob], `plant-${Date.now()}.jpg`, { type: 'image/jpeg' }));
                    stopStream();
                }
            }, 'image/jpeg', 0.9);
        }
    };

    useEffect(() => { startStream(); return () => stopStream(); }, [facingMode]);

    return (
        <div className="w-full max-w-sm mx-auto overflow-hidden rounded-3xl shadow-2xl bg-black relative">
            {error ? <div className="p-8 text-white text-center">{error}</div> : (
                <>
                    <video ref={videoRef} autoPlay playsInline muted className="w-full aspect-square object-cover" />
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="absolute top-4 right-4 flex gap-2">
                         <button onClick={() => setFacingMode(f => f === 'user' ? 'environment' : 'user')} className="p-3 bg-black/40 backdrop-blur-md rounded-full text-white"><RefreshCw className="w-6 h-6" /></button>
                    </div>
                    <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                        <button onClick={capture} disabled={!isStreaming} className="w-20 h-20 bg-white rounded-full border-4 border-brand-green p-1 transition-transform active:scale-90 shadow-2xl" />
                    </div>
                </>
            )}
        </div>
    );
};

const LoadingSequence: React.FC<{ t: (key: string) => string }> = ({ t }) => (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl shadow-xl animate-fade-in w-full max-w-sm">
        <div className="relative mb-6">
            <div className="w-20 h-20 border-4 border-brand-green/20 rounded-full border-t-brand-green animate-spin" />
            <Leaf className="absolute inset-0 m-auto w-8 h-8 text-brand-green animate-pulse" />
        </div>
        <p className="text-lg font-bold text-brand-gray-dark text-center">{t('loading_consulting')}</p>
    </div>
);

const ZoomModal: React.FC<{ imageUrl: string, onClose: () => void, t: (key: string) => string }> = ({ imageUrl, onClose, t }) => {
    const [scale, setScale] = useState(1);
    const zoomIn = () => setScale(s => Math.min(s + 0.5, 4));
    const zoomOut = () => setScale(s => Math.max(s - 0.5, 0.5));
    const reset = () => setScale(1);

    return (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden touch-none" onClick={onClose}>
            <div className="absolute top-6 right-6 flex gap-3 z-[110]" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"><X className="w-8 h-8" /></button>
            </div>

            <div className="relative flex items-center justify-center w-full h-full" onClick={e => e.stopPropagation()}>
                <img 
                    src={imageUrl} 
                    alt="Zoomed" 
                    className="max-w-full max-h-full object-contain transition-transform duration-300 ease-out shadow-2xl rounded-lg"
                    style={{ transform: `scale(${scale})` }}
                />
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 bg-black/40 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl z-[110]" onClick={e => e.stopPropagation()}>
                <button onClick={zoomOut} className="p-2 text-white hover:text-brand-green transition-colors" title={t('zoomOut')}><ZoomOut className="w-7 h-7" /></button>
                <div className="w-px h-6 bg-white/20 mx-1" />
                <button onClick={reset} className="p-2 text-white hover:text-brand-green transition-colors" title={t('resetZoom')}><RotateCcw className="w-6 h-6" /></button>
                <div className="w-px h-6 bg-white/20 mx-1" />
                <button onClick={zoomIn} className="p-2 text-white hover:text-brand-green transition-colors" title={t('zoomIn')}><ZoomIn className="w-7 h-7" /></button>
            </div>
        </div>
    );
};

const ResultDisplay: React.FC<{ result: PlantAnalysis, imageUrl: string, onReset: () => void, t: (key: string) => string }> = ({ result, imageUrl, onReset, t }) => {
    const [showZoom, setShowZoom] = useState(false);
    return (
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden animate-fade-in mb-8">
            {showZoom && <ZoomModal imageUrl={imageUrl} onClose={() => setShowZoom(false)} t={t} />}
            <div className="relative group cursor-zoom-in h-72" onClick={() => setShowZoom(true)}>
                <img src={imageUrl} alt="Result" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white flex items-center gap-2 border border-white/30 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize className="w-5 h-5" /> {t('clickToZoom')}
                    </div>
                </div>
            </div>
            <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                    {result.diseaseName.toLowerCase() === 'healthy' ? <CheckCircle className="w-8 h-8 text-brand-green" /> : <XCircle className="w-8 h-8 text-red-500" />}
                    <h2 className="text-3xl font-bold text-brand-gray-dark">{result.diseaseName}</h2>
                </div>
                <div className="mb-6 px-4 py-2 bg-brand-gray-light rounded-xl inline-block text-sm font-bold text-brand-green-dark">
                    {t('confidence')}: {result.confidence}
                </div>
                <section className="mb-8">
                    <h3 className="text-xl font-bold mb-3 text-brand-green-dark border-b-2 border-brand-green/20 pb-1">{t('description')}</h3>
                    <p className="text-brand-gray-dark whitespace-pre-wrap leading-relaxed">{result.description}</p>
                </section>
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <section>
                        <h3 className="text-lg font-bold mb-3 text-brand-green-dark flex items-center gap-2"><Zap className="w-5 h-5" />{t('treatmentPlan')}</h3>
                        <ul className="space-y-2 text-sm">{result.treatment.map((s, i) => <li key={i} className="flex gap-2"><span>•</span>{s}</li>)}</ul>
                    </section>
                    <section>
                        <h3 className="text-lg font-bold mb-3 text-brand-green-dark flex items-center gap-2"><RotateCcw className="w-5 h-5" />{t('preventionTips')}</h3>
                        <ul className="space-y-2 text-sm">{result.prevention.map((s, i) => <li key={i} className="flex gap-2"><span>•</span>{s}</li>)}</ul>
                    </section>
                </div>

                {/* Community Engagement Section */}
                <div className="bg-brand-gray-light/50 p-6 rounded-2xl border border-brand-green/10 mb-8 flex flex-col items-center text-center">
                    <Users className="w-10 h-10 text-brand-green mb-3" />
                    <h3 className="text-lg font-bold text-brand-green-dark mb-1">{t('community')}</h3>
                    <p className="text-sm text-brand-gray-dark mb-4">{t('communityDesc')}</p>
                    <a 
                      href="https://community.plantdoctor.ai" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-2 bg-white border border-brand-green text-brand-green font-bold rounded-full hover:bg-brand-green hover:text-white transition-all text-sm"
                    >
                      {t('visitCommunity')} <ExternalLink className="w-4 h-4" />
                    </a>
                </div>

                <button onClick={onReset} className="w-full py-4 bg-brand-green text-white font-bold rounded-2xl shadow-lg hover:bg-brand-green-dark transition-all transform hover:-translate-y-1">{t('analyzeAnother')}</button>
            </div>
        </div>
    );
};

export default function App() {
    const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<PlantAnalysis | null>(null);
    const [language, setLanguage] = useState<LanguageCode>('en');
    const [error, setError] = useState<string | null>(null);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    const t = (key: string) => (translations[language] as any)[key] || (translations.en as any)[key];

    useEffect(() => {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        });

        window.addEventListener('appinstalled', () => {
            setDeferredPrompt(null);
            console.log('App was installed');
        });
    }, []);

    const handleInstall = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setDeferredPrompt(null);
            }
        }
    };

    useEffect(() => {
        if (imageFile) {
            const url = URL.createObjectURL(imageFile);
            setImageUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [imageFile]);

    const handleAnalysis = async (desc: string) => {
        if (!imageFile) return;
        setStatus(AppStatus.ANALYZING);
        try {
            const { base64, mimeType } = await fileToBase64(imageFile);
            const res = await analyzePlantHealth(base64, mimeType, desc, language);
            setAnalysisResult(res);
            setStatus(AppStatus.SUCCESS);
        } catch (err: any) {
            setError(err.message);
            setStatus(AppStatus.ERROR);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center font-sans bg-brand-gray-light text-brand-gray-dark overflow-x-hidden selection:bg-brand-green/30">
            <Header t={t} language={language} setLanguage={setLanguage} installPrompt={deferredPrompt} onInstall={handleInstall} />
            <main className="w-full max-w-2xl px-4 py-8 flex flex-col items-center">
                {status === AppStatus.IDLE && (
                    <div className="text-center animate-fade-in">
                        <div className="w-24 h-24 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"><Leaf className="w-12 h-12 text-brand-green" /></div>
                        <p className="text-xl text-brand-gray-dark mb-10 leading-relaxed">{t('heroParagraph')}</p>
                        <button onClick={() => setStatus(AppStatus.UPLOADING_IMAGE)} className="px-12 py-5 bg-brand-green text-white font-bold rounded-full shadow-2xl hover:scale-105 transition-transform">{t('getStarted')}</button>
                    </div>
                )}

                {status === AppStatus.UPLOADING_IMAGE && (
                    <div className="w-full animate-fade-in">
                        <button onClick={() => setStatus(AppStatus.IDLE)} className="mb-6 flex items-center gap-1 font-bold text-brand-gray"><ChevronLeft className="w-5 h-5" />{t('back')}</button>
                        <div className="grid gap-6">
                            <CameraCapture onCapture={(f) => { setImageFile(f); setStatus(AppStatus.RECORDING_AUDIO); }} t={t} />
                            <label className="p-8 border-4 border-dashed border-brand-green/20 rounded-3xl bg-white text-center cursor-pointer hover:bg-brand-green/5 transition-colors shadow-sm">
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => { if (e.target.files?.[0]) { setImageFile(e.target.files[0]); setStatus(AppStatus.RECORDING_AUDIO); } }} />
                                <Upload className="w-10 h-10 text-brand-green mx-auto mb-3" />
                                <span className="font-bold text-brand-green-dark">{t('uploaderLabel')}</span>
                            </label>
                        </div>
                    </div>
                )}

                {status === AppStatus.RECORDING_AUDIO && (
                    <div className="w-full animate-fade-in">
                        <button onClick={() => setStatus(AppStatus.UPLOADING_IMAGE)} className="mb-6 flex items-center gap-1 font-bold text-brand-gray"><ChevronLeft className="w-5 h-5" />{t('back')}</button>
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-brand-green/10">
                            <h2 className="text-2xl font-bold mb-2 text-brand-green-dark">{t('step2Title')}</h2>
                            <p className="text-brand-gray mb-6">{t('step2Desc')}</p>
                            <textarea id="desc" className="w-full h-32 p-4 bg-brand-gray-light rounded-2xl mb-6 focus:ring-2 focus:ring-brand-green border-none outline-none" placeholder={t('textAreaPlaceholder')} />
                            <button onClick={() => handleAnalysis((document.getElementById('desc') as HTMLTextAreaElement).value)} className="w-full py-4 bg-brand-green text-white font-bold rounded-2xl shadow-xl hover:bg-brand-green-dark transition-all">{t('analyzePlant')}</button>
                        </div>
                    </div>
                )}

                {status === AppStatus.ANALYZING && <LoadingSequence t={t} />}
                {status === AppStatus.SUCCESS && analysisResult && imageUrl && <ResultDisplay result={analysisResult} imageUrl={imageUrl} onReset={() => setStatus(AppStatus.IDLE)} t={t} />}
                {status === AppStatus.ERROR && <div className="text-center p-12 bg-white rounded-3xl shadow-xl"><XCircle className="w-16 h-16 text-red-500 mx-auto mb-4"/><h2 className="text-2xl font-bold mb-2">{t('errorTitle')}</h2><p className="text-brand-gray mb-6">{error}</p><button onClick={() => setStatus(AppStatus.IDLE)} className="px-8 py-3 bg-brand-green text-white font-bold rounded-xl">{t('tryAgain')}</button></div>}
            </main>
        </div>
    );
}
