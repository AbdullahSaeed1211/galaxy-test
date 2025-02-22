# Galaxy AI - Video Transformation Tool 🎥✨

A powerful AI-powered video transformation tool built with Next.js that uses the Fal AI Hunyuan-Video Model to apply advanced video transformations. Users can upload source videos and specify transformation parameters to generate stylized or enhanced output videos.

## 🌟 Features
### Core Functionality
- **AI-Powered Video Transformation**: Utilize Fal AI's Hunyuan-Video Model for high-quality video transformations
- **Customizable Parameters**: Fine-tune your transformations with various parameters:
  - Prompt-based styling
  - Inference steps control
  - Strength adjustment
  - Aspect ratio selection (16:9, 9:16)
  - Resolution options (480p, 580p, 720p)
  - Frame count selection
  - Pro mode for advanced users
  - Safety checker toggle

### User Experience
- **Intuitive Upload Interface**: Easy-to-use Uploadcare integration for video uploads
- **Real-time Progress Tracking**: Monitor transformation progress
- **Transformation History**: View and manage past transformations
- **Secure Authentication**: User authentication powered by Clerk
- **Responsive Design**: Beautiful UI built with TailwindCSS and ShadCN

### Technical Features
- **Secure File Storage**: Cloudinary integration for reliable video storage
- **Database Management**: MongoDB for storing transformation history and metadata
- **Asynchronous Processing**: Non-blocking video processing with webhook support
- **Error Handling**: Comprehensive error management and user feedback
- **Input Validation**: File format and size validation
- **Security**: HTTPS, secure API keys, and webhook validation

## 🔄 User Flow

1. **Authentication**
   - Sign up/Sign in using Clerk authentication
   - Redirect to dashboard after successful authentication

2. **Video Upload**
   - Upload source video through Uploadcare interface
   - Supported formats: MP4, MOV, AVI, WMV
   - Maximum file size: 100MB
   - Real-time upload progress indication

3. **Transformation Setup**
   - Enter transformation prompt
   - Configure transformation parameters
   - Advanced options available in pro mode

4. **Processing**
   - Automatic upload to Cloudinary for secure storage
   - Transformation processing through Fal AI
   - Real-time progress updates
   - Webhook handling for completion

5. **Results & History**
   - View transformed video
   - Download capabilities
   - Access transformation history
   - View metadata and parameters used

## 🛠️ Tech Stack

- **Framework**: Next.js with TypeScript
- **UI/UX**: v0.dev (AI-powered design)
- **Styling**: TailwindCSS + ShadCN
- **Authentication**: Clerk
- **Database**: MongoDB
- **File Storage**: Cloudinary
- **File Upload**: Uploadcare
- **Video Processing**: Fal AI (Hunyuan-Video Model)
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB database
- Accounts set up with:
  - Clerk
  - Cloudinary
  - Uploadcare
  - Fal AI

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/galaxy-ai.git
   cd galaxy-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your API keys and configuration

4. Run the development server:
   ```bash
   npm run dev
   ```

## 🔑 Environment Variables

Create a `.env` file with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# MongoDB
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/your-database

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Uploadcare
NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY=your_uploadcare_public_key
UPLOADCARE_SECRET_KEY=your_uploadcare_secret_key

# Fal AI
FAL_AI_API_KEY=your_fal_ai_api_key
FAL_AI_MODEL_ID=your_model_id

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
MAX_VIDEO_SIZE_MB=100
ALLOWED_VIDEO_FORMATS=mp4,mov,avi,wmv
DEFAULT_TRANSFORMATION_QUOTA=10
```

## 📝 API Routes

- `POST /api/video/process`: Initialize video transformation
- `POST /api/webhook`: Handle transformation completion
- `GET /api/history`: Retrieve transformation history
- `GET /api/video/:id`: Get specific transformation details

## 🔒 Security Considerations

- All API keys are securely stored in environment variables
- User authentication required for all operations
- Secure file upload and storage
- Input validation and sanitization
- Rate limiting on API routes
- Webhook validation for callbacks

## 📈 Performance Optimization

- Asynchronous video processing
- Optimized file uploads
- Efficient database queries
- Caching implementation
- Loading state management

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
#   g a l a x y - t e s t 
 
 
