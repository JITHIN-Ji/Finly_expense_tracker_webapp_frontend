import { Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop.jsx'
import Home from './pages/Home.jsx'
import LoginPage from './pages/login.jsx'
import RegisterPage from './pages/register.jsx'
import OnboardingPage from './pages/OnboardingPage.jsx'
import DashboardPage from './pages/dashboard.jsx'
import InsightsPage from './pages/InsightsPage.jsx'
import HistoryPage from './pages/HistoryPage.jsx'
import SettingsPage from './pages/settings.jsx'
import PersonalInformationPage from './pages/PersonalInformationPage.jsx'
import ChangePasswordPage from './pages/ChangePasswordPage.jsx'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/settings/personal-information" element={<PersonalInformationPage />} />
        <Route path="/settings/change-password" element={<ChangePasswordPage />} />
      </Routes>
    </>
  )
}
