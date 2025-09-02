# AI-Powered CV Builder Application

A comprehensive, production-ready CV builder application with OpenAI integration, featuring advanced AI tools, multiple templates, and ATS optimization.

## 🚀 Features

### Core Features
- **Multi-step CV Builder**: Guided 6-step process for creating professional CVs
- **AI-Powered Content Generation**: OpenAI integration for summaries, optimization, and cover letters
- **Professional Templates**: Multiple industry-specific, ATS-friendly templates
- **Real-time Preview**: Live CV preview with PDF export functionality
- **User Authentication**: Secure login/registration system
- **Cloud Storage**: Save and manage multiple CV versions
- **Mobile Responsive**: Optimized for all device sizes

### AI Features (OpenAI Integration)
- **AI Summary Generator**: Automatically generate professional summaries
- **Experience Optimizer**: AI-powered work experience enhancement
- **Cover Letter Generator**: Personalized cover letters based on job descriptions
- **ATS Score Checker**: AI analysis of CV compatibility with ATS systems
- **Interview Question Generator**: Role-specific interview preparation
- **CV Optimization**: Job-specific CV tailoring suggestions

### Advanced Features
- **Export Options**: PDF, DOCX, and shareable link generation
- **Template Filtering**: Category-based template selection
- **Progress Tracking**: Visual progress indicators and completion status
- **Auto-save**: Automatic draft saving functionality
- **Responsive Design**: Mobile-first design approach

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for build tooling
- **jsPDF & html2canvas** for PDF generation

### AI Integration
- **OpenAI GPT-4** for content generation
- **Advanced prompt engineering** for optimal results

### Backend (Ready for Integration)
- **Node.js** with Express
- **Supabase** for database and authentication
- **JWT** for session management

## 📋 Prerequisites

Before running this application, ensure you have:

1. **Node.js** (v18 or higher)
2. **npm** or **yarn** package manager
3. **OpenAI API Key** (GPT-4 access recommended)
4. **Supabase Account** (for production database)

## 🚀 Local Development Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd cv-builder-app

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration (for production)
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Application Configuration
VITE_APP_URL=http://localhost:5173
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🗄️ Database Setup (Supabase)

### 1. Create Supabase Project

1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Copy your project URL and anon key to `.env`

### 2. Database Schema

Run these SQL commands in your Supabase SQL editor:

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CVs table
CREATE TABLE public.cvs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  template_id TEXT NOT NULL,
  data JSONB NOT NULL,
  ats_score INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT FALSE,
  share_url TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cvs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own CVs" ON public.cvs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own CVs" ON public.cvs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own CVs" ON public.cvs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own CVs" ON public.cvs
  FOR DELETE USING (auth.uid() = user_id);
```

### 3. Authentication Setup

In your Supabase dashboard:
1. Go to Authentication > Settings
2. Enable email authentication
3. Disable email confirmation for development
4. Configure your site URL

## 🚀 Production Deployment

### Frontend Deployment (Vercel/Netlify)

1. **Build the application**:
```bash
npm run build
```

2. **Deploy to Vercel**:
```bash
npm install -g vercel
vercel --prod
```

3. **Environment Variables**: Add your environment variables in the deployment platform

### Backend Deployment (Optional - for advanced features)

For advanced features like file storage and enhanced security:

1. **Deploy to Railway/Heroku**:
```bash
# Example for Railway
npm install -g @railway/cli
railway login
railway init
railway up
```

2. **Environment Variables**: Configure production environment variables

## 🔧 Configuration

### OpenAI API Setup

1. Get your API key from [OpenAI Platform](https://platform.openai.com)
2. Ensure you have GPT-4 access for best results
3. Add the key to your `.env` file

### Supabase Setup

1. Create project at [Supabase](https://supabase.com)
2. Run the database schema (see Database Setup section)
3. Configure authentication settings
4. Add credentials to `.env` file

## 📱 Mobile Optimization

The application is fully responsive with:
- **Mobile-first design approach**
- **Touch-friendly interface elements**
- **Optimized navigation for small screens**
- **Responsive grid layouts**
- **Mobile-specific UI patterns**

## 🔒 Security Features

- **JWT-based authentication**
- **Row Level Security (RLS) in Supabase**
- **Input validation and sanitization**
- **Secure API key handling**
- **CORS configuration**

## 🎨 UI/UX Features

- **Modern, clean design**
- **Smooth animations and transitions**
- **Intuitive navigation**
- **Progress indicators**
- **Loading states**
- **Error handling**
- **Accessibility compliance**

## 📊 Analytics & Monitoring

- **ATS score tracking**
- **Usage analytics**
- **Performance monitoring**
- **Error tracking**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Open an issue on GitHub
- Contact the development team

---

**Note**: This application uses OpenAI's GPT-4 API which requires an active subscription. Ensure you have sufficient API credits for production use.