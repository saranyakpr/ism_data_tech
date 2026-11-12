"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { OTHER_SERVICE_OPTION, SERVICES } from "@/lib/data";

const schema = z.object({
  name:z.string().min(2,"Name must be at least 2 characters"),
  company:z.string().optional(),
  email:z.string().email("Please enter a valid email"),
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
  country:z.string().min(2,"Please enter your country"),
  service:z.string().min(1,"Please select a service"),
  requirements:z.string().min(20,"Please describe your requirements (min 20 characters)"),
  timeline:z.string().optional(),
  consent:z.boolean().refine(v=>v===true,"You must agree to continue"),
});
type F = z.infer<typeof schema>;

const L = ({children,req}:{children:React.ReactNode;req?:boolean}) => (
  <label className="block text-[15px] font-bold uppercase tracking-wider mb-2"
    style={{color:"var(--text2)",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
    {children}{req&&<span className="text-red-700 ml-1">*</span>}
  </label>
);
const E = ({msg}:{msg?:string}) => msg?<p className="text-red-700 text-sm mt-1">{msg}</p>:null;

export default function ContactForm() {
  const [status,setStatus]=useState<"idle"|"loading"|"success"|"error">("idle");
  const [err,setErr]=useState("");
  const {register,handleSubmit,reset,formState:{errors}}=useForm<F>({resolver:zodResolver(schema)});

const onSubmit = async (data: F) => {
  setStatus("loading");
  setErr("");

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(
        result.error || "Unable to send your enquiry. Please try again."
      );
    }

    setStatus("success");
    reset();
  } catch (error) {
    setStatus("error");
    setErr(
      error instanceof Error
        ? error.message
        : "Something went wrong. Please email official@ismdatatech.com directly."
    );
  }
};

  if(status==="success") return (
    <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} className="text-center py-14">
      <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
        style={{background:"rgba(0,85,255,0.08)"}}>
        <CheckCircle size={30} style={{color:"var(--ism-accent)"}}/>
      </div>
      <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:22,color:"var(--ism-navy)",marginBottom:8}}>Enquiry Sent!</h3>
      <p style={{color:"var(--text2)",marginBottom:20}}>
  Thank you for contacting ISM Data Technology. Your enquiry has been received.
</p>
      <button onClick={()=>setStatus("idle")} className="btn-outline text-sm">Send Another</button>
    </motion.div>
  );

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity:0, y:18 }}
      whileInView={{ opacity:1, y:0 }}
      viewport={{ once:false, amount:0.2 }}
      transition={{ duration:0.6, ease:[0.16,1,0.3,1] }}
      className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div><L req>Full Name</L><input {...register("name")} placeholder="John Smith" className="field"/><E msg={errors.name?.message}/></div>
        <div><L>Company Name</L><input {...register("company")} placeholder="Your Company" className="field"/></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div><L req>Business Email</L><input {...register("email")} type="email" placeholder="you@company.com" className="field"/><E msg={errors.email?.message}/></div>
        <div><L req>Phone Number</L><input {...register("phone")} placeholder="+1 555 000 0000" className="field"/><E msg={errors.phone?.message}/></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div><L req>Country</L><input {...register("country")} placeholder="United States" className="field"/><E msg={errors.country?.message}/></div>
        <div><L req>Service Interested In</L>
          <select {...register("service")} className="field">
            <option value="">Select…</option>
            {SERVICES.map(service => (
              <option key={service.id} value={service.title}>{service.title}</option>
            ))}
            <option value={OTHER_SERVICE_OPTION}>{OTHER_SERVICE_OPTION}</option>
          </select><E msg={errors.service?.message}/>
        </div>
      </div>
      <div><L req>Project Requirements</L><textarea {...register("requirements")} rows={4} placeholder="Describe your project and requirements…" className="field resize-none"/><E msg={errors.requirements?.message}/></div>
      <div><L>Expected Timeline</L>
        <select {...register("timeline")} className="field">
          <option value="">Select…</option>
          {["As soon as possible","Within 1 month","1–3 months","3–6 months","Ongoing / Long-term"].map(t=><option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="flex items-start gap-3">
        <input type="checkbox" {...register("consent")} id="consent" className="mt-1 w-4 h-4 cursor-pointer flex-shrink-0" style={{accentColor:"var(--ism-accent)"}}/>
        <label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer" style={{color:"var(--text2)"}}>
          I agree that ISM Data Technology may contact me regarding my enquiry per their privacy policy.
        </label>
      </div>
      <E msg={errors.consent?.message}/>
      {status==="error"&&(
        <div className="flex items-start gap-2 p-4 rounded-xl" style={{background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.15)"}}>
          <AlertCircle size={15} className="text-red-700 mt-0.5 flex-shrink-0"/>
          <p className="text-red-700 text-sm">{err}</p>
        </div>
      )}
      <motion.button type="submit" disabled={status==="loading"} className="btn-primary w-full justify-center"
        whileHover={{scale:1.02}} whileTap={{scale:0.97}}>
        {status==="loading"?<><Loader2 size={15} className="animate-spin"/>Sending…</>:<><Send size={15}/>Send Enquiry</>}
      </motion.button>
    </motion.form>
  );
}
