import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, 
  MessageSquarePlus, 
  Search, 
  LayoutDashboard, 
  LogOut, 
  Send, 
  AlertCircle,
  Loader2,
  CheckCircle2,
  Clock,
  ChevronRight,
  Filter,
  BarChart3,
  Layers,
  Menu,
  X
} from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Navbar = ({ isAdmin, onLogout }: { isAdmin: boolean, onLogout: () => void }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "File a Complaint", path: "/submit" },
    { name: "Track Progress", path: "/track" },
    ...(isAdmin ? [{ name: "Admin Dashboard", path: "/admin/dashboard" }] : [{ name: "Staff Portal", path: "/admin/login" }]),
  ];

  return (
    <nav className="bg-university-green text-white px-6 py-4 flex items-center justify-between shadow-lg relative z-50">
      <Link to="/" className="flex items-center gap-3">
        <div className="bg-university-yellow p-2 rounded-full">
          <ShieldCheck className="text-university-green w-6 h-6" />
        </div>
        <span className="text-2xl font-bold tracking-tight">CampusVoice</span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-6 items-center">
        {navLinks.map(link => (
          <Link key={link.path} to={link.path} className="hover:text-university-yellow transition-colors font-medium">
            {link.name}
          </Link>
        ))}
        {isAdmin && (
          <button 
            onClick={onLogout}
            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all text-sm font-medium flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        )}
      </div>

      {/* Hamburger Menu Move to Top Right */}
      <div className="md:hidden">
        <button 
          id="hamburger-menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-university-green border-t border-white/10 shadow-2xl md:hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map(link => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-xl font-bold hover:text-university-yellow border-b border-white/5 pb-4"
                >
                  {link.name}
                </Link>
              ))}
              {isAdmin && (
                <button 
                  onClick={() => { onLogout(); setIsMenuOpen(false); }}
                  className="text-left text-xl font-bold text-university-yellow flex items-center gap-2"
                >
                  <LogOut className="w-6 h-6" /> Sign Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-gray-900 text-gray-400 py-12 px-6">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h3 className="text-white font-bold mb-4">CampusVoice</h3>
        <p className="text-sm">Empowering student voices through safe, anonymous feedback. Together we build a better campus.</p>
      </div>
      <div>
        <h3 className="text-white font-bold mb-4">Quick Links</h3>
        <ul className="text-sm space-y-2">
          <li><Link to="/submit" className="hover:text-university-yellow">Report an Issue</Link></li>
          <li><Link to="/track" className="hover:text-university-yellow">Check Progress</Link></li>
          <li><Link to="/admin/login" className="hover:text-university-yellow">Administrator Access</Link></li>
        </ul>
      </div>
      <div>
        <h3 className="text-white font-bold mb-4">Legal</h3>
        <p className="text-sm">Your identity is protected. We do not store any identifying information when you report a problem.</p>
      </div>
    </div>
  </footer>
);

// --- Pages ---

const LandingPage = () => (
  <div className="min-h-[80vh] flex flex-col">
    <header className="relative h-[500px] flex items-center justify-center text-center px-6 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=2000" 
          className="w-full h-full object-cover brightness-[0.3]"
          alt="University Campus"
        />
      </div>
      <div className="relative z-10 max-w-3xl">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
        >
          Your Voice matters. <span className="text-university-yellow">Anonymously.</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-200 mb-10"
        >
          Report campus issues without fear. We use AI to group similar concerns, helping Women's University in Africa prioritize what matters most to students.
        </motion.p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/submit" className="bg-university-green hover:bg-green-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-xl flex items-center justify-center gap-2">
            <MessageSquarePlus className="w-6 h-6" />
            File a Report
          </Link>
          <Link to="/track" className="bg-white hover:bg-gray-100 text-university-green px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-xl flex items-center justify-center gap-2">
            <Search className="w-6 h-6" />
            Track an Issue
          </Link>
        </div>
      </div>
    </header>

    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
            <ShieldCheck className="text-university-green w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-4">Total Anonymity</h3>
          <p className="text-gray-600 leading-relaxed">No emails, no names, no IDs. Your submission is assigned a random tracking code, ensuring your privacy is 100% protected.</p>
        </div>
        <div className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center mb-6">
            <Layers className="text-university-yellow w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-4">AI Smart Clustering</h3>
          <p className="text-gray-600 leading-relaxed">Multiple reports about the same issue (like Wi-Fi in the library) are automatically grouped. This forces faster administration action.</p>
        </div>
        <div className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
            <Clock className="text-blue-600 w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-4">Real-time Updates</h3>
          <p className="text-gray-600 leading-relaxed">See if your concern is being investigated, in progress, or resolved. The administration provides updates you can track instantly.</p>
        </div>
      </div>
    </section>
  </div>
);

const SubmitReport = () => {
  const [formData, setFormData] = useState({ category: "", description: "", location: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{trackingCode: string} | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      alert("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="max-w-xl mx-auto py-20 px-6 text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-10 rounded-3xl shadow-2xl border-4 border-university-green"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-university-green w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Report Submitted!</h2>
          <p className="text-gray-600 mb-8">Your report has been received anonymously. Please save your tracking code below to check on its progress.</p>
          <div className="bg-university-yellow/20 p-6 rounded-2xl mb-8">
            <span className="text-sm font-bold text-university-green uppercase block mb-1">Your Tracking Code</span>
            <span className="text-4xl font-mono font-bold text-university-green tracking-widest">{result.trackingCode}</span>
          </div>
          <button 
            onClick={() => navigate("/")}
            className="text-university-green font-bold hover:underline"
          >
            Return to Homepage
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-16 px-6">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-bold mb-2">Anonymous Report</h2>
        <p className="text-gray-500 mb-8">Please describe the issue in detail. Do not include your name or any identifying information.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Problem Category</label>
            <select 
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-university-green outline-none"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option value="">Select a category...</option>
              <option value="Academic">Academic Concerns</option>
              <option value="Facilities">Facilities & Infrastructure</option>
              <option value="Safety">Campus Safety</option>
              <option value="Governance">Governance & Administration</option>
              <option value="Health">Health & Sanitization</option>
              <option value="Other">Other Issues</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Location (Optional)</label>
            <input 
              type="text" 
              placeholder="e.g. Science Lab B, Main Library 3rd Floor..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-university-green outline-none"
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description of the Issue</label>
            <textarea 
              required
              rows={5}
              placeholder="Provide a clear description of the problem..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-university-green outline-none resize-none"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-university-green hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Send className="w-5 h-5" /> Submit Anonymously</>}
          </button>
        </form>
      </div>
    </div>
  );
};

const TrackReport = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setReport(null);
    try {
      const resp = await fetch(`/api/reports/${code.toUpperCase()}`);
      if (resp.ok) {
        setReport(await resp.json());
      } else {
        setError("Invalid tracking code. Please check and try again.");
      }
    } catch {
      setError("Sync error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-gray-100 text-gray-600";
      case "investigating": return "bg-blue-100 text-blue-600";
      case "in-progress": return "bg-yellow-100 text-yellow-700";
      case "resolved": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-16 px-6">
      <div className="bg-white p-10 rounded-3xl shadow-xl mb-8">
        <h2 className="text-3xl font-bold mb-2">Track Progress</h2>
        <p className="text-gray-500 mb-8">Enter your 6-character tracking code to see updates from the administration.</p>
        
        <form onSubmit={handleTrack} className="flex gap-4">
          <input 
            type="text" 
            required
            maxLength={6}
            placeholder="XXXXXX"
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-6 py-4 text-2xl font-mono text-center font-bold focus:ring-2 focus:ring-university-green outline-none uppercase tracking-widest"
            value={code}
            onChange={e => setCode(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-university-green hover:bg-green-700 disabled:bg-gray-400 text-white font-bold px-8 rounded-xl transition-all shadow-lg flex items-center justify-center"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Track"}
          </button>
        </form>
        {error && <p className="text-red-500 mt-4 font-medium flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</p>}
      </div>

      <AnimatePresence>
        {report && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white p-10 rounded-3xl shadow-xl border-l-8 border-university-green"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Issue Status</span>
                <span className={cn("px-4 py-1 rounded-full text-sm font-bold uppercase", getStatusColor(report.status))}>
                  {report.status}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Created At</span>
                <span className="font-medium text-gray-600">{new Date(report.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            
            <h3 className="text-xl font-bold mb-2">{report.category} Concern</h3>
            {report.location && <p className="text-sm text-gray-400 mb-4 font-medium">📍 {report.location}</p>}
            
            <div className="bg-gray-50 p-6 rounded-2xl mb-8">
              <p className="text-gray-700 italic">"{report.description}"</p>
            </div>

            <div className="border-t pt-8">
              <h4 className="font-bold flex items-center gap-2 mb-4">
                <BarChart3 className="text-university-green w-5 h-5" />
                Administrative Action
              </h4>
              <div className="space-y-4">
                {report.status === 'pending' && (
                  <p className="text-sm text-gray-500">Your report is waiting to be reviewed by the campus management team.</p>
                )}
                {report.status === 'investigating' && (
                  <p className="text-sm text-blue-500">The administration is currently investigating your concern.</p>
                )}
                {report.status === 'in-progress' && (
                  <p className="text-sm text-yellow-600 font-medium">This issue is currently being addressed by the relevant department.</p>
                )}
                {report.status === 'resolved' && (
                  <p className="text-sm text-green-600 font-bold">This issue has been successfully resolved. Thank you for your feedback!</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AdminLogin = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('cv_admin')) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user, password: pass })
      });
      const data = await resp.json();
      if (resp.ok) {
        onLoginSuccess();
        navigate("/admin/dashboard");
      } else {
        alert(data.error || "Login failed");
      }
    } catch {
      alert("System error");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await fetch("/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user, password: pass, employeeId })
      });
      const data = await resp.json();
      if (resp.ok) {
        alert("Account Successfully Created! Returning to login.");
        setIsRegistering(false);
      } else {
        alert(data.error || "Registration failed");
      }
    } catch {
      alert("System error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
        <div className="w-16 h-16 bg-university-yellow rounded-2xl flex items-center justify-center mb-6 mx-auto">
          {isRegistering ? <ShieldCheck className="text-university-green w-10 h-10" /> : <LayoutDashboard className="text-university-green w-10 h-10" />}
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">{isRegistering ? "Staff Registration" : "Staff Login"}</h2>
        <p className="text-center text-gray-500 text-sm mb-8">
          {isRegistering 
            ? "Verify your Employee ID to create a secure account." 
            : "Access the administrative dashboard."}
        </p>

        <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
          {isRegistering && (
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Unique Employee ID</label>
              <input 
                type="text" 
                required
                placeholder="e.g., WUA-STAFF-101"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-university-green outline-none font-mono"
                value={employeeId}
                onChange={e => setEmployeeId(e.target.value)}
              />
            </div>
          )}
          
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Username</label>
            <input 
              type="text" 
              required
              placeholder="choose a username"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-university-green outline-none"
              value={user}
              onChange={e => setUser(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Password</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-university-green outline-none"
              value={pass}
              onChange={e => setPass(e.target.value)}
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-university-green text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:bg-green-700 disabled:bg-gray-300"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (isRegistering ? "Register Account" : "Login")}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t text-center">
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-university-green text-sm font-bold hover:underline mb-4 block mx-auto"
          >
            {isRegistering ? "Already have an account? Login here" : "First time? Register with Employee ID"}
          </button>
          
          <div className="bg-gray-50 p-4 rounded-xl text-left border border-gray-100">
            <div className="mb-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Demo Administrative Access:</span>
              <div className="bg-white p-3 rounded border text-xs font-mono">
                <p><span className="text-gray-400">User:</span> admin</p>
                <p><span className="text-gray-400">Pass:</span> admin123</p>
              </div>
            </div>

            <span className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Verified Staff IDs (for registration):</span>
            <div className="flex flex-wrap gap-2">
              <code className="text-[10px] bg-white px-2 py-1 rounded border">WUA-STAFF-101</code>
              <code className="text-[10px] bg-white px-2 py-1 rounded border">WUA-STAFF-102</code>
              <code className="text-[10px] bg-white px-2 py-1 rounded border">WUA-STAFF-103</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [reports, setReports] = useState<any[]>([]);
  const [clusters, setClusters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('cv_admin')) {
      navigate("/admin/login");
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rResp, cResp] = await Promise.all([
        fetch("/api/admin/reports"),
        fetch("/api/admin/clusters")
      ]);
      setReports(await rResp.json());
      setClusters(await cResp.json());
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/reports/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    fetchData();
  };

  const handleArchive = async (id: string) => {
    if (!confirm("Are you sure you want to archive this resolved report? It will be moved to the secure backup database.")) return;
    
    try {
      const resp = await fetch(`/api/admin/reports/${id}`, { method: "DELETE" });
      if (resp.ok) {
        fetchData();
      } else {
        const data = await resp.json();
        alert(data.error);
      }
    } catch {
      alert("Archive failed");
    }
  };

  const aiClustering = async () => {
    if (reports.length === 0) return;
    setLoading(true);
    try {
      const { clusterReports } = await import("@/src/services/geminiService");
      const unassignedReports = reports.filter(r => !r.cluster_id);
      const result = await clusterReports(unassignedReports, clusters);
      
      if (result && result.assignments) {
        for (const assignment of result.assignments) {
          let cid = assignment.clusterId;
          
          if (assignment.newCluster) {
            const resp = await fetch("/api/admin/clusters", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(assignment.newCluster)
            });
            const { id } = await resp.json();
            cid = id;
          }

          if (cid) {
            await fetch(`/api/admin/reports/${assignment.reportId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: "reviewed", cluster_id: cid })
            });
          }
        }
        await fetchData();
        alert("AI Clustering complete! New patterns identified.");
      }
    } catch (error) {
      console.error(error);
      alert("AI analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-12 h-12 animate-spin text-university-green" /></div>

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-4xl font-bold mb-2">Management Dashboard</h2>
          <p className="text-gray-500">Real-time overview of campus issues and resolutions.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={aiClustering}
            className="bg-university-yellow text-university-green font-bold px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-yellow-400 transition-colors"
          >
            <BarChart3 className="w-5 h-5" />
            Run AI Cluster Analysis
          </button>
          <button 
            onClick={() => { onLogout(); navigate("/"); }}
            className="bg-red-50 text-red-600 font-bold px-6 py-3 rounded-xl flex items-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6">
          <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
            <MessageSquarePlus className="text-university-green w-8 h-8" />
          </div>
          <div>
            <span className="text-3xl font-bold block">{reports.length}</span>
            <span className="text-sm text-gray-500 font-medium">Total Reports</span>
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6">
          <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center">
            <Layers className="text-university-yellow w-8 h-8" />
          </div>
          <div>
            <span className="text-3xl font-bold block">{clusters.length}</span>
            <span className="text-sm text-gray-500 font-medium">Issue Clusters</span>
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6">
          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Clock className="text-blue-600 w-8 h-8" />
          </div>
          <div>
            <span className="text-3xl font-bold block">{reports.filter(r => r.status === 'pending').length}</span>
            <span className="text-sm text-gray-500 font-medium">Pending Action</span>
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6">
          <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center">
            <CheckCircle2 className="text-green-600 w-8 h-8" />
          </div>
          <div>
            <span className="text-3xl font-bold block">{reports.filter(r => r.status === 'resolved').length}</span>
            <span className="text-sm text-gray-500 font-medium">Resolved</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 h-fit">
          <div className="p-8 border-b bg-gray-50/50">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Layers className="text-university-green w-5 h-5" />
              Active Issue Clusters
            </h3>
          </div>
          <div className="p-8 space-y-6">
            {clusters.length === 0 ? (
              <p className="text-gray-400 italic">No clusters identified yet. Run AI analysis to find patterns.</p>
            ) : (
              clusters.map(c => {
                const count = reports.filter(r => r.cluster_id === c.id).length;
                return (
                  <div key={c.id} className="border-b pb-4 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-800">{c.title}</h4>
                      <span className="bg-university-green text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {count} Reports
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{c.description}</p>
                    <div className="flex gap-2">
                      <span className="text-[10px] uppercase font-bold text-gray-400">Status: {c.status}</span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8 border-b flex justify-between items-center bg-gray-50/50">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Filter className="text-university-green w-5 h-5" />
              Recent Submissions
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans">
              <tbody className="divide-y divide-gray-100">
                {reports.slice(0, 5).map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-university-green mb-1 uppercase">{r.category}</span>
                        <p className="text-sm text-gray-700 font-medium line-clamp-1">{r.description}</p>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase", 
                        r.status === 'pending' ? 'bg-gray-100 text-gray-600' :
                        r.status === 'investigating' ? 'bg-blue-100 text-blue-600' :
                        r.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      )}>
                        {r.status.replace('-', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-gray-50 text-center">
             <span className="text-xs text-gray-400 font-medium">Scroll down for full report management table</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-8 border-b bg-gray-50/50">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <LayoutDashboard className="text-university-green w-5 h-5" />
            Full Report Management
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-400 text-[10px] font-bold uppercase tracking-widest border-b">
                <th className="px-8 py-4">Date Filed</th>
                <th className="px-8 py-4">Report Details</th>
                <th className="px-8 py-4">Location</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reports.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-700">{new Date(r.created_at).toLocaleDateString()}</span>
                      <span className="text-[10px] text-gray-400">{new Date(r.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold bg-university-yellow/20 text-university-green px-2 py-1 rounded mb-2 inline-block">
                      {r.category}
                    </span>
                    <p className="text-sm text-gray-700 font-medium line-clamp-2 max-w-md">{r.description}</p>
                    <span className="text-[10px] text-gray-400 font-bold uppercase mt-2 block tracking-tighter">CODE: {r.tracking_code}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm text-gray-500 italic">{r.location || "N/A"}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn("px-4 py-1 rounded-full text-xs font-bold uppercase", 
                      r.status === 'pending' ? 'bg-gray-100 text-gray-600' :
                      r.status === 'investigating' ? 'bg-blue-100 text-blue-600' :
                      r.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    )}>
                      {r.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <select 
                        className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-university-green"
                        value={r.status}
                        onChange={(e) => handleUpdateStatus(r.id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="investigating">Under Investigation</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                      {r.status === 'resolved' && (
                        <button 
                          onClick={() => handleArchive(r.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors group"
                          title="Archive Resolved Issue"
                        >
                          <LogOut className="w-4 h-4 rotate-90" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem('cv_admin'));

  const handleLogout = () => {
    localStorage.removeItem('cv_admin');
    setIsAdmin(false);
  };

  const handleLoginSuccess = () => {
    localStorage.setItem('cv_admin', 'true');
    setIsAdmin(true);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col font-sans selection:bg-university-yellow/30">
        <Navbar isAdmin={isAdmin} onLogout={handleLogout} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/submit" element={<SubmitReport />} />
            <Route path="/track" element={<TrackReport />} />
            <Route path="/admin/login" element={<AdminLogin onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/admin/dashboard" element={<AdminDashboard onLogout={handleLogout} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
