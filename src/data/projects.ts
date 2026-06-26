import type { Project } from "../types";

export const projects: Project[] = [
  {
    uid: "project-aicare",
    year: "2025",
    title: "小雅医生 (AICare): AI-Powered Clinical Decision Support Platform for Electronic Health Record Analysis",
    authors: "Yinghao Zhu, Dehao Sui, Zixiang Wang, Junyi Gao, Liantao Ma",
    venue: 'Deployed on PKU Xplore "clinical medicine + X" Platform',
    links: [
      { type: "Platform", url: "https://xiaobeihealth.pku.edu.cn/xiaoya/" },
      { type: "Website", url: "https://mp.weixin.qq.com/s/l34ELxfwkB_QDv_HxfaemA" },
      { type: "Video", url: "https://www.bilibili.com/video/BV1wDD3YKEGg" },
    ],
  },
];
