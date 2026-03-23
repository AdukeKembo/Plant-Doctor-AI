import { GoogleGenAI, Type } from "@google/genai";
import type { PlantAnalysis, LanguageCode } from '../types.ts';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Multi-lingual schemas for structured output
const schemas = {
  en: {
    type: Type.OBJECT,
    properties: {
      diseaseName: { type: Type.STRING, description: "Common name of the identified plant disease. If no disease is detected, state 'Healthy'." },
      confidence: { type: Type.STRING, description: "Confidence level of the diagnosis (High, Medium, Low, or Uncertain)." },
      description: { type: Type.STRING, description: "A comprehensive analysis including: 1) Identification of the plant species (common and scientific name), 2) Common issues for this specific species, and 3) Detailed explanation of the detected problem, symptoms, and potential causes. If healthy, provide general plant care tips." },
      treatment: { type: Type.ARRAY, description: "A list of recommended treatment steps. If healthy, this can be an empty array.", items: { type: Type.STRING } },
      prevention: { type: Type.ARRAY, description: "A list of preventative measures to avoid future occurrences. If healthy, this can be an empty array.", items: { type: Type.STRING } },
    },
    required: ["diseaseName", "confidence", "description", "treatment", "prevention"]
  },
  sw: {
    type: Type.OBJECT,
    properties: {
      diseaseName: { type: Type.STRING, description: "Jina la kawaida la ugonjwa wa mmea uliotambuliwa. Ikiwa hakuna ugonjwa uliogunduliwa, taja 'Mwenye Afya'." },
      confidence: { type: Type.STRING, description: "Kiwango cha uhakika wa utambuzi (Juu, Kati, Chini, au Hakuna Uhakika)." },
      description: { type: Type.STRING, description: "Uchambuzi wa kina ikiwa ni pamoja na: 1) Utambulisho wa spishi za mimea (jina la kawaida na la kisayansi), 2) Masuala ya kawaida kwa spishi hii maalum, na 3) Maelezo ya kina ya tatizo lililogunduliwa, dalili, na sababu zinazoweza kutokea." },
      treatment: { type: Type.ARRAY, description: "Orodha ya hatua za matibabu zinazopendekezwa. Ikiwa ni mwenye afya, hii inaweza kuwa safu tupu.", items: { type: Type.STRING } },
      prevention: { type: Type.ARRAY, description: "Orodha ya hatua za kinga ili kuzuia kutokea tena siku za usoni. Ikiwa ni mwenye afya, hii inaweza kuwa safu tupu.", items: { type: Type.STRING } },
    },
    required: ["diseaseName", "confidence", "description", "treatment", "prevention"]
  },
  fr: {
    type: Type.OBJECT,
    properties: {
      diseaseName: { type: Type.STRING, description: "Nom commun de la maladie de la plante identifiée. Si aucune maladie n'est détectée, indiquez 'Sain'." },
      confidence: { type: Type.STRING, description: "Niveau de confiance du diagnostic (Élevé, Moyen, Faible ou Incertain)." },
      description: { type: Type.STRING, description: "Une analyse complète comprenant : 1) L'identification de l'espèce végétale (nom commun et scientifique), 2) Les problèmes courants pour cette espèce spécifique, et 3) Une explication détaillée du problème détecté, des symptômes et des causes potentielles." },
      treatment: { type: Type.ARRAY, description: "Liste des étapes de traitement recommandées. Si la plante est saine, ce peut être un tableau vide.", items: { type: Type.STRING } },
      prevention: { type: Type.ARRAY, description: "Liste des mesures préventives pour éviter de futures occurrences. Si la plante est saine, ce peut être un tableau vide.", items: { type: Type.STRING } },
    },
    required: ["diseaseName", "confidence", "description", "treatment", "prevention"]
  },
  ar: {
    type: Type.OBJECT,
    properties: {
      diseaseName: { type: Type.STRING, description: "الاسم الشائع لمرض النبات الذي تم تحديده. إذا لم يتم الكشف عن أي مرض، اذكر 'بصحة جيدة'." },
      confidence: { type: Type.STRING, description: "مستوى الثقة في التشخيص (مرتفع، متوسط، منخفض، أو غير مؤكد)." },
      description: { type: Type.STRING, description: "تحليل شامل يشمل: 1) تحديد أنواع النباتات (الاسم الشائع والعلمي)، 2) المشكلات الشائعة لهذا النوع المحدد، و3) شرح مفصل للمشكلة المكتشفة والأعراض والأسباب المحتملة." },
      treatment: { type: Type.ARRAY, description: "قائمة بخطوات العلاج الموصى بها. إذا كان النبات بصحة جيدة، يمكن أن تكون هذه مصفوفة فارغة.", items: { type: Type.STRING } },
      prevention: { type: Type.ARRAY, description: "قائمة بالتدابير الوقائية لتجنب الحدوث في المستقبل. إذا كان النبات بصحة جيدة، يمكن أن تكون هذه مصفوفة فارغة.", items: { type: Type.STRING } },
    },
    required: ["diseaseName", "confidence", "description", "treatment", "prevention"]
  },
  de: {
    type: Type.OBJECT,
    properties: {
      diseaseName: { type: Type.STRING, description: "Allgemeiner Name der identifizierten Pflanzenkrankheit. Wenn keine Krankheit festgestellt wird, geben Sie 'Gesund' an." },
      confidence: { type: Type.STRING, description: "Konfidenzniveau der Diagnose (Hoch, Mittel, Niedrig oder Unsicher)." },
      description: { type: Type.STRING, description: "Eine umfassende Analyse bestehend aus: 1) Identifizierung der Pflanzenart (gebräuchlicher und wissenschaftlicher Name), 2) Häufige Probleme für diese spezifische Art und 3) Detaillierte Erläuterung des erkannten Problems, der Symptome und der möglichen Ursachen." },
      treatment: { type: Type.ARRAY, description: "Eine Liste empfohlener Behandlungsschritte. Wenn die Pflanze gesund ist, kann dies ein leeres Array sein.", items: { type: Type.STRING } },
      prevention: { type: Type.ARRAY, description: "Eine Liste von vorbeugenden Maßnahmen, um zukünftige Vorkommnisse zu vermeiden. Wenn die Pflanze gesund ist, kann dies ein leeres Array sein.", items: { type: Type.STRING } },
    },
    required: ["diseaseName", "confidence", "description", "treatment", "prevention"]
  },
  hi: {
    type: Type.OBJECT,
    properties: {
      diseaseName: { type: Type.STRING, description: "पहचाने गए पौधे के रोग का सामान्य नाम। यदि कोई रोग नहीं पाया जाता है, तो 'स्वस्थ' बताएं।" },
      confidence: { type: Type.STRING, description: "निदान का आत्मविश्वास स्तर (उच्च, मध्यम, निम्न, या अनिश्चित)।" },
      description: { type: Type.STRING, description: "एक व्यापक विश्लेषण जिसमें शामिल है: 1) पौधों की प्रजातियों की पहचान (सामान्य और वैज्ञानिक नाम), 2) इस विशिष्ट प्रजाति के लिए सामान्य समस्याएं, और 3) पता चली समस्या, लक्षणों और संभावित कारणों का विस्तृत विवरण।" },
      treatment: { type: Type.ARRAY, description: "अनुशंसित उपचार चरणों की एक सूची। यदि पौधा स्वस्थ है, तो यह एक खाली सरणी हो सकती है।", items: { type: Type.STRING } },
      prevention: { type: Type.ARRAY, description: "भविष्य में होने वाली घटनाओं से बचने के लिए निवारक उपायों की एक सूची। यदि पौधा स्वस्थ है, तो यह एक खाली सरणी हो सकती है।", items: { type: Type.STRING } },
    },
    required: ["diseaseName", "confidence", "description", "treatment", "prevention"]
  },
  es: {
    type: Type.OBJECT,
    properties: {
      diseaseName: { type: Type.STRING, description: "Nombre común de la enfermedad de la planta identificada. Si no se detecta ninguna enfermedad, indique 'Saludable'." },
      confidence: { type: Type.STRING, description: "Nivel de confianza del diagnóstico (Alto, Medio, Bajo o Incierto)." },
      description: { type: Type.STRING, description: "Un análisis integral que incluye: 1) Identificación de la especie de planta (nombre común y científico), 2) Problemas comunes para esta especie específica y 3) Explicación detallada del problema detectado, síntomas y posibles causas." },
      treatment: { type: Type.ARRAY, description: "Una lista de los pasos de tratamiento recomendados. Si está sana, puede ser un arreglo vacío.", items: { type: Type.STRING } },
      prevention: { type: Type.ARRAY, description: "Una lista de medidas preventivas para evitar futuras apariciones. Si está sana, puede ser un arreglo vacío.", items: { type: Type.STRING } },
    },
    required: ["diseaseName", "confidence", "description", "treatment", "prevention"]
  },
  it: {
    type: Type.OBJECT,
    properties: {
      diseaseName: { type: Type.STRING, description: "Nome comune della malattia della pianta identificata. Se non viene rilevata alcuna malattia, indicare 'Sana'." },
      confidence: { type: Type.STRING, description: "Livello di confidenza della diagnosi (Alto, Medio, Basso o Incerto)." },
      description: { type: Type.STRING, description: "Un'analisi completa che includa: 1) Identificazione della specie vegetale (nome comune e scientifico), 2) Problemi comuni per questa specifica specie e 3) Spiegazione dettagliata del problema rilevato, dei sintomi e delle potenziali cause." },
      treatment: { type: Type.ARRAY, description: "Un elenco dei passaggi di trattamento consigliati. Se sana, questo può essere un array vuoto.", items: { type: Type.STRING } },
      prevention: { type: Type.ARRAY, description: "Un elenco di misure preventive per evitare future occorrenze. Se sana, questo può essere un array vuoto.", items: { type: Type.STRING } },
    },
    required: ["diseaseName", "confidence", "description", "treatment", "prevention"]
  },
};

const systemInstructions = {
  en: "You are an expert botanist and plant pathologist. Your task is to analyze plant images and user descriptions to identify species and diseases. Provide a precise diagnosis, confidence level, comprehensive description (including species ID and common species-specific issues), treatment plan, and prevention tips. If the plant is healthy, provide general care advice. Response must be valid JSON.",
  sw: "Wewe ni mtaalamu wa mimea na magonjwa ya mimea. Kazi yako ni kuchanganua picha za mimea na maelezo ya watumiaji ili kutambua spishi na magonjwa. Toa utambuzi sahihi, kiwango cha uhakika, maelezo ya kina (ikiwa ni pamoja na utambulisho wa spishi na masuala ya kawaida ya spishi), mpango wa matibabu, na vidokezo vya kuzuia. Ikiwa mmea ni mwenye afya, toa ushauri wa jumla wa utunzaji. Jibu lazima liwe JSON halali na kwa Kiswahili.",
  fr: "Vous êtes un botaniste et phytopathologiste expert. Votre tâche consiste à analyser les images de plantes et les descriptions des utilisateurs pour identifier les espèces et les maladies. Fournissez un diagnostic précis, un niveau de confiance, une description complète (y compris l'identification de l'espèce et les problèmes courants de l'espèce), un plan de traitement et des conseils de prévention. Si la plante est saine, donnez des conseils d'entretien généraux. La réponse doit être un JSON valide et en français.",
  ar: "أنت خبير في علم النبات وأمراض النبات. مهمتك هي تحليل صور النباتات وأوصاف المستخدمين لتحديد الأنواع والأمراض. قدم تشخيصًا دقيقًا، ومستوى الثقة، ووصفًا شاملاً (بما في ذلك تحديد الأنواع والمشكلات الشائعة الخاصة بالأنواع)، وخطة علاج، ونصائح للوقاية. إذا كان النبات سليمًا، فقدم نصائح عامة للعناية به. يجب أن تكون الاستجابة بتنسيق JSON صالح وباللغة العربية.",
  de: "Sie sind ein Experte für Botanik und Pflanzenpathologie. Ihre Aufgabe ist es, Pflanzenbilder und Benutzerbeschreibungen zu analysieren, um Arten und Krankheiten zu identifizieren. Geben Sie eine präzise Diagnose, ein Konfidenzniveau, eine umfassende Beschreibung (einschließlich Artenidentifikation und häufiger artenspezifischer Probleme), einen Behandlungsplan und Präventionstipps an. Wenn die Pflanze gesund ist, geben Sie allgemeine Pflegetipps. Die Antwort muss ein gültiges JSON sein und auf Deutsch erfolgen.",
  hi: "आप एक विशेषज्ञ वनस्पतिशास्त्री और पादप रोगविज्ञानी हैं। आपका काम पौधों की छवियों और उपयोगकर्ता विवरणों का विश्लेषण करके प्रजातियों और बीमारियों की पहचान करना है। सटीक निदान, आत्मविश्वास स्तर, व्यापक विवरण (प्रजाति आईडी और सामान्य प्रजाति-विशिष्ट समस्याओं सहित), उपचार योजना और रोकथाम युक्तियाँ प्रदान करें। यदि पौधा स्वस्थ है, तो सामान्य देखभाल सलाह प्रदान करें। प्रतिक्रिया मान्य JSON होनी चाहिए और हिंदी में होनी चाहिए।",
  es: "Eres un experto botánico y fitopatólogo. Tu tarea es analizar imágenes de plantas y descripciones de usuarios para identificar especies y enfermedades. Proporciona un diagnóstico preciso, nivel de confianza, descripción completa (incluida la identificación de la especie y los problemas comunes específicos de la especie), plan de tratamiento y consejos de prevención. Si la planta está sana, proporciona consejos generales de cuidado. La respuesta debe ser un JSON válido y en español.",
  it: "Sei un botanico esperto e un fitopatologo. Il tuo compito è analizzare le immagini delle piante e le descrizioni degli utenti per identificare specie e malattie. Fornisci una diagnosi precisa, un livello di confidenza, una descrizione completa (inclusa l'identificazione della specie e i problemi comuni specifici della specie), un piano di trattamento e consigli di prevenzione. Se la pianta è sana, fornisci consigli generali sulla cura. La risposta deve essere un JSON valido e in italiano.",
};

export const analyzePlantHealth = async (
  imageBase64: string,
  mimeType: string,
  userDescription: string,
  language: LanguageCode = 'en'
): Promise<PlantAnalysis> => {
  const instruction = systemInstructions[language] || systemInstructions.en;
  const schema = schemas[language] || schemas.en;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { text: `Symptoms described by user: "${userDescription}"` },
          {
            inlineData: {
              mimeType: mimeType,
              data: imageBase64,
            },
          },
        ],
      },
      config: {
        systemInstruction: instruction,
        responseMimeType: 'application/json',
        responseSchema: schema,
        thinkingConfig: { thinkingBudget: 16000 },
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    // Validate the result format
    if (
      result &&
      typeof result.diseaseName === 'string' &&
      typeof result.confidence === 'string' &&
      typeof result.description === 'string' &&
      Array.isArray(result.treatment) &&
      Array.isArray(result.prevention)
    ) {
      return result as PlantAnalysis;
    } else {
      throw new Error("Diagnosis data failed internal validation.");
    }

  } catch (error) {
    console.error("Gemini Diagnosis Error:", error);
    if (error instanceof Error) {
        throw new Error(`Botanist consultation failed: ${error.message}`);
    }
    throw new Error("An unexpected error occurred during the plant analysis process.");
  }
};
