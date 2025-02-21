export const config = {
  uploadcare: {
    publicKey: process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY!,
    secretKey: process.env.UPLOADCARE_SECRET_KEY!,
    maxVideoSize: parseInt(process.env.MAX_VIDEO_SIZE_MB || '100') * 1024 * 1024, // Convert MB to bytes
    allowedFormats: (process.env.ALLOWED_VIDEO_FORMATS || 'mp4,mov,avi,wmv').split(','),
  },
  cloudinary: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    apiSecret: process.env.CLOUDINARY_API_SECRET!,
  },
  falAi: {
    apiKey: process.env.FAL_AI_API_KEY!,
    modelId: process.env.FAL_AI_MODEL_ID!,
  },
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL!,
    defaultQuota: parseInt(process.env.DEFAULT_TRANSFORMATION_QUOTA || '10'),
  },
  transformationStyles: [
    { id: 'anime', name: 'Anime Style', description: 'Transform your video into anime style' },
    { id: 'cartoon', name: 'Cartoon Style', description: 'Transform your video into cartoon style' },
    // Add more styles as they become available
  ],
} as const;

export type TransformationStyle = typeof config.transformationStyles[number]['id'];

export const validateEnvironmentVariables = () => {
  const requiredEnvVars = [
    'NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY',
    'UPLOADCARE_SECRET_KEY',
    'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'FAL_AI_API_KEY',
    'FAL_AI_MODEL_ID',
    'MONGODB_URI',
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(', ')}`
    );
  }
}; 