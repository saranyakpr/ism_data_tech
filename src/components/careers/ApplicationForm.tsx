"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Send, CheckCircle, AlertCircle, Loader2, Upload } from "lucide-react";
import type { PublicJob } from "@/lib/jobs";

const MAX_FILE = 5*1024*1024;
const ALLOWED = ["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

const schema = z.object({
  jobId:       z.string().uuid("Please select an open position"),
  fullName:    z.string().min(2,"Name must be at least 2 characters"),
  email:       z.string().email("Please enter a valid email"),
  phone: z
  .string()
  .trim()
  .refine(
    (value) => {
      const digits = value.replace(/\D/g, "");
      return digits.length >= 7 && digits.length <= 15;
    },
    "Please enter a valid phone number (7–15 digits)"
  ),
  location:    z.string().min(2,"Please enter your current location"),
  experience:  z.string().min(1,"Please select your experience level"),
  education:   z.string().min(2,"Please enter your highest qualification"),
  skills:      z.string().min(10,"Please list your relevant skills"),
  linkedin:    z.string().optional(),
  portfolio:   z.string().optional(),
  coverLetter: z.string().optional(),
  consent:     z.boolean().refine(v=>v===true,"You must agree to continue"),
});
type F = z.infer<typeof schema>;

const L = ({children,req}:{children:React.ReactNode;req?:boolean}) => (
  <label className="block text-sm font-bold uppercase tracking-wider mb-2"
    style={{color:"var(--text2)",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
    {children}{req&&<span className="text-red-500 ml-1">*</span>}
  </label>
);
const E = ({msg}:{msg?:string}) => msg?<p className="text-red-500 text-sm mt-1">{msg}</p>:null;

export default function ApplicationForm({
  jobs,
  initialJobId,
}: {
  jobs: Pick<PublicJob, "id" | "title">[];
  initialJobId?: string;
}) {
  const [status,setStatus]=useState<"idle"|"loading"|"success"|"error">("idle");
  const [err,setErr]=useState("");
  const [fileName,setFileName]=useState("");
  const [fileErr,setFileErr]=useState("");
  const [resumeData,setResumeData]=useState("");

  const {register,handleSubmit,reset,formState:{errors}}=useForm<F>({
    resolver:zodResolver(schema),defaultValues:{jobId:initialJobId ?? ""},
  });

  const handleFile=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const file=e.target.files?.[0];setFileErr("");
    if(!file)return;
    setFileName("");setResumeData("");
    if(!ALLOWED.includes(file.type)){setFileErr("Only PDF, DOC or DOCX files allowed.");return;}
    if(file.size>MAX_FILE){setFileErr("File must be smaller than 5MB.");return;}
    setFileName(file.name);
    const r=new FileReader();r.onload=()=>setResumeData(r.result as string);r.readAsDataURL(file);
  };

  const onSubmit=async(data:F)=>{
    if(!resumeData){setFileErr("Please upload your resume.");return;}
    setStatus("loading");
    try{
      const res=await fetch("/api/careers/apply",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...data,resumeData,resumeName:fileName})});
      if(!res.ok) {
        const body = await res.json() as {error?:string};
        throw new Error(body.error ?? "Submission failed.");
      }
      setStatus("success");reset();setFileName("");setResumeData("");
    }catch(error){setStatus("error");setErr(error instanceof Error ? error.message : "Submission failed. Please email hr@ismdatatech.com directly.");}
  };

  if(status==="success") return (
    <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} className="text-center py-14">
      <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
        style={{background:"rgba(0,85,255,0.08)"}}>
        <CheckCircle size={30} style={{color:"var(--ism-accent)"}}/>
      </div>
      <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:22,color:"var(--ism-navy)",marginBottom:8}}>Application Received!</h3>
      <p style={{color:"var(--text2)",marginBottom:20}}>Our HR team will review and contact you if there&apos;s a match.</p>
      <button onClick={()=>setStatus("idle")} className="btn-outline text-sm">Submit Another</button>
    </motion.div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div><L req>Full Name</L><input {...register("fullName")} placeholder="Your full name" className="field"/><E msg={errors.fullName?.message}/></div>
        <div><L req>Email Address</L><input {...register("email")} type="email" placeholder="you@email.com" className="field"/><E msg={errors.email?.message}/></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div><L req>Phone Number</L><input {...register("phone")} placeholder="+91 98765 43210" className="field"/><E msg={errors.phone?.message}/></div>
        <div><L req>Current Location</L><input {...register("location")} placeholder="City, State" className="field"/><E msg={errors.location?.message}/></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div><L req>Position Applying For</L>
          <select {...register("jobId")} className="field">
            <option value="">Select an open position…</option>
            {jobs.map(job=><option key={job.id} value={job.id}>{job.title}</option>)}
          </select><E msg={errors.jobId?.message}/>
        </div>
        <div><L req>Years of Experience</L>
          <select {...register("experience")} className="field">
            <option value="">Select…</option>
            {["Fresher (0 years)","0–1 year","1–2 years","2–4 years","4–6 years","6+ years"].map(e=><option key={e}>{e}</option>)}
          </select><E msg={errors.experience?.message}/>
        </div>
      </div>
      <div><L req>Highest Education</L><input {...register("education")} placeholder="e.g. B.Com, BCA, Any Degree" className="field"/><E msg={errors.education?.message}/></div>
      <div><L req>Technical Skills</L><textarea {...register("skills")} rows={3} placeholder="MS Office, Data Entry, Typing 45 WPM, English Communication…" className="field resize-none"/><E msg={errors.skills?.message}/></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div><L>LinkedIn (optional)</L><input {...register("linkedin")} placeholder="https://linkedin.com/in/…" className="field"/></div>
        <div><L>Portfolio / GitHub (optional)</L><input {...register("portfolio")} placeholder="https://github.com/…" className="field"/></div>
      </div>
      <div>
        <L req>Upload Resume <span style={{textTransform:"none",letterSpacing:0,fontWeight:400,color:"var(--text3)"}}>(PDF/DOC/DOCX — max 5MB)</span></L>
        <label className="flex items-center gap-3 w-full rounded-2xl px-5 py-4 cursor-pointer transition-all"
          style={{background:"rgba(0,85,255,0.04)",border:"2px dashed rgba(0,85,255,0.3)"}}>
          <Upload size={18} style={{color:"var(--ism-accent)",flexShrink:0}}/>
          <span style={{fontSize:15,color:fileName?"var(--ism-accent)":"var(--text2)",fontWeight:fileName?600:400}}>
            {fileName||"Click to upload your resume"}
          </span>
          <input type="file" accept=".pdf,.doc,.docx" onChange={handleFile} className="hidden"/>
        </label>
        <E msg={fileErr}/>
      </div>
      <div><L>Cover Letter (optional)</L><textarea {...register("coverLetter")} rows={4} placeholder="Tell us why you want to work at ISM Data Technology…" className="field resize-none"/></div>
      <div className="flex items-start gap-3">
        <input type="checkbox" {...register("consent")} id="app-consent" className="mt-1 w-4 h-4 cursor-pointer flex-shrink-0" style={{accentColor:"var(--ism-accent)"}}/>
        <label htmlFor="app-consent" className="text-sm leading-relaxed cursor-pointer" style={{color:"var(--text2)"}}>
          I consent to ISM Data Technology storing my application for recruitment purposes. My data will be handled securely.
        </label>
      </div>
      <E msg={errors.consent?.message}/>
      {status==="error"&&(
        <div className="flex items-start gap-2 p-4 rounded-xl" style={{background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.15)"}}>
          <AlertCircle size={15} className="text-red-500 mt-0.5 flex-shrink-0"/><p className="text-red-500 text-sm">{err}</p>
        </div>
      )}
      <motion.button type="submit" disabled={status==="loading"} className="btn-primary w-full justify-center"
        whileHover={{scale:1.02}} whileTap={{scale:0.97}}>
        {status==="loading"?<><Loader2 size={15} className="animate-spin"/>Submitting…</>:<><Send size={15}/>Submit Application</>}
      </motion.button>
    </form>
  );
}
