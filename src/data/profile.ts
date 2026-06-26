import type { Profile } from "../types";

export const profile: Profile = {
  name: "Zixiang Wang",
  cnName: "王子翔",
  title: "Master's Student",
  affiliation: "Peking University",
  school: "School of Software and Microelectronics",
  email: "wangzx@stu.pku.edu.cn",
  bio: 'I am a master\'s student at <strong>Peking University</strong>, advised by <a href="http://scholar.pku.edu.cn/malt" target="_blank" rel="noopener noreferrer">Prof. Liantao Ma</a>. My research focuses on <strong>AI for Healthcare</strong>, especially medical large language models, electronic health record modeling, multi-agent collaboration, and reusable benchmark/toolkit infrastructure for clinical data analysis.',
  interests: [
    {
      uid: "medical-llm",
      title: "Medical Large Language Models",
      description: "Building and evaluating LLM-driven systems for clinical prediction, reasoning, retrieval, and decision support.",
    },
    {
      uid: "ehr-modeling",
      title: "Electronic Health Record Modeling",
      description: "Modeling longitudinal, sparse, and multimodal EHR data with attention to clinical reliability and reuse.",
    },
    {
      uid: "benchmarks-toolkits",
      title: "Benchmarks, Toolkits, and Protocols",
      description: "Creating open resources that make healthcare AI evaluation more reproducible and practically useful.",
    },
  ],
  scholarStats: {
    citations: "274",
    hIndex: "7",
    i10Index: "6",
    updatedAt: "2026.04.22",
  },
};
