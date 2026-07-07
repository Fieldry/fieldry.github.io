import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import type {
  AwardItem,
  LinkItem,
  Project,
  Publication,
  ServiceItem,
} from "../src/types";
import { siteData } from "../src/utils/site-data";

const DEFAULT_OUTPUT_PATH = "build/cv/ZixiangWang_CV_CN.tex";
const HOMEPAGE_URL =
  siteData.quickLinks.find((link) => link.name === "Homepage")?.url ??
  "https://fieldry.github.io/";
const SCHOLAR_URL =
  siteData.quickLinks.find((link) => link.name === "Scholar")?.url ??
  "https://scholar.google.com/citations?user=U73PSFAAAAAJ";

const outputPath = resolve(
  process.cwd(),
  process.argv[2] ?? DEFAULT_OUTPUT_PATH,
);

const publicationsByUid = new Map(
  siteData.publications.map((publication) => [publication.uid, publication]),
);
const cvServices = mergeCvServices(siteData.services);

const profileCn = {
  name: "王子翔",
  bio: "我是北京大学软件与微电子学院硕士研究生，导师为马连韬教授和王亚沙教授。我的研究方向为医疗健康人工智能，重点关注医疗大语言模型及多智能体协作应用、时序电子病历数据建模，以及面向临床数据分析的可复用基准与工具基础设施。",
  interests: [
    {
      title: "医疗大语言模型",
      description: "构建并评估面向临床预测、推理、检索和决策支持的大语言模型驱动的多智能体系统。",
    },
    {
      title: "时序电子病历数据建模",
      description: "面向纵向、稀疏和多模态 EHR 数据进行建模，关注临床可靠性与复用。",
    },
    {
      title: "基准、工具包与协议",
      description: "构建开放资源，提高医疗健康 AI 评估的可复现性与实际可用性。",
    },
  ],
};

const publicationSections = [
  {
    title: "Core Work",
    authorMode: "full",
    publications: [
      {
        uid: "publication-colacare",
        label: "WWW 2025\\\\[-0.1mm]- CCF A",
      },
      {
        uid: "publication-aicopilot-chi",
        label: "CHI 2026\\\\[-0.1mm]- CCF A",
      },
      {
        uid: "publication-retcare",
        label: "KDD 2024\\\\[-0.1mm]- CCF A",
      },
      {
        uid: "publication-clinicrealm",
        label: "npj Digital Medicine 2026",
      },
      {
        uid: "publication-healthflow",
        label: "npj Digital Medicine 2026 - Minor Revision",
        title:
          "HealthFlow: Automating electronic health record\nanalysis via a strategically self-evolving multi-agent framework",
        authors:
          "Yinghao Zhu, Zixiang Wang, Yifan Qi, Lei Gu, Dehao Sui, Haoran Hu, Xichen Zhang, Ziyi He, Junjun He, Liantao Ma, Lequan Yu",
        firstAuthors: "Yinghao Zhu, Zixiang Wang, Yifan Qi",
      },
      {
        uid: "publication-covid-protocol",
        label: "STAR Protocols 2025",
      },
    ],
  },
  {
    title: "LLM Agents for Healthcare",
    authorMode: "coauthors",
    publications: [
      { uid: "publication-ehrflow", label: "KDD 2024" },
      { uid: "publication-emerge", label: "CIKM 2024" },
    ],
  },
  {
    title: "Toolkits \\& Platforms \\& Benchmarks",
    pageBreakBefore: true,
    authorMode: "coauthors",
    publications: [
      { uid: "publication-oneehr", label: "KDD 2026" },
      { uid: "publication-aicare-sail", label: "SAIL 2025" },
      { uid: "publication-medagentboard", label: "NeurIPS 2025" },
      { uid: "publication-patterns-covid", label: "Cell Patterns 2024" },
      { uid: "publication-pd-protocol", label: "STAR Protocols 2024" },
      { uid: "publication-medagentaudit", label: "Preprint 2026" },
    ],
  },
  {
    title: "Healthcare Modeling",
    authorMode: "coauthors",
    publications: [
      { uid: "publication-pai", label: "KDD 2025" },
      { uid: "publication-prism", label: "CIKM 2024" },
    ],
  },
] as const;

const cv = String.raw`\documentclass[10pt,a4paper]{article}

\usepackage[left=0.48in,right=0.48in,top=0.45in,bottom=0.48in]{geometry}
\usepackage{iftex}
\ifPDFTeX
  \usepackage[utf8]{inputenc}
  \usepackage[T1]{fontenc}
  \IfFileExists{ctex.sty}{\usepackage[UTF8]{ctex}}{}
  \IfFileExists{cmbright.sty}{\usepackage{cmbright}}{\usepackage{helvet}\renewcommand{\familydefault}{\sfdefault}}
\else
  \usepackage{fontspec}
  \IfFileExists{xeCJK.sty}{\usepackage{xeCJK}}{}
  \IfFontExistsTF{Arial}{\setmainfont{Arial}}{\setmainfont{Helvetica Neue}}
  \IfFontExistsTF{PingFang SC}{\setCJKmainfont{PingFang SC}}{}
\fi
\usepackage[protrusion=true,expansion=false]{microtype}
\usepackage{hyperref}
\usepackage{enumitem}
\usepackage{parskip}
\usepackage{xcolor}
\pagenumbering{gobble}

\definecolor{darkred}{RGB}{153,0,0}
\definecolor{textgray}{RGB}{55,65,81}
\definecolor{mutedgray}{RGB}{100,116,139}
\newlength{\pubcategorywidth}

\hypersetup{
    colorlinks=true,
    linkcolor=darkred,
    urlcolor=darkred,
    pdftitle={${tex(profileCn.name)}的简历},
    pdfauthor={${tex(profileCn.name)}},
    pageanchor=false
}
\urlstyle{same}

\newcommand{\sectiontitle}[1]{%
    \par\vspace{2.6mm}%
    \noindent{\Large\textbf{#1}}\par
    \vspace{0.9mm}%
    \hrule width \textwidth height 0.36pt
    \vspace{1.85mm}%
}

\newcommand{\pubcategorytitle}[1]{%
    \par\vspace{1.2mm}%
    \settowidth{\pubcategorywidth}{{\normalsize\textbf{#1}}}%
    \noindent{\normalsize\textcolor{darkred}{\textbf{#1}}}\par
    \vspace{0.45mm}%
    {\color{darkred}\hrule width \pubcategorywidth height 0.32pt}
    \vspace{1.45mm}%
}

\newcommand{\entryhead}[2]{
    \noindent
    \begin{minipage}[t]{0.82\textwidth}
    \raggedright #1
    \end{minipage}
    \hfill
    \begin{minipage}[t]{0.16\textwidth}
    \raggedleft\footnotesize\textcolor{mutedgray}{#2}
    \end{minipage}
    \par
}

\newcommand{\educationentry}[4]{
    \entryhead{#1}{#2}
    {\small #3\par}
    #4
    \vspace{1mm}
}

\newcommand{\pubentry}[5]{
    \noindent
    \begin{minipage}[t]{0.145\textwidth}
    \raggedright\small\textbf{#1}
    \end{minipage}
    \hfill
    \begin{minipage}[t]{0.84\textwidth}
    {\small\textbf{\textcolor{black}{#2}}}\\[-0.1mm]
    {\small #3}\\[-0.1mm]
    {\small\textit{#4}, #5}
    \end{minipage}
    \par\vspace{1.35mm}
}

\newcommand{\cvmarker}{
    \makebox[0.018\textwidth][l]{\raisebox{0.36ex}{\textcolor{darkred}{\scriptsize$\triangleright$}}}%
}

\newcommand{\cvdetail}[1]{\textnormal{\textcolor{textgray}{#1}}}

\newcommand{\cvitem}[3]{
    \noindent
    \cvmarker
    \begin{minipage}[t]{0.855\textwidth}{\small\strut\textbf{#1}#2}\end{minipage}
    \hfill
    \makebox[0.105\textwidth][r]{\small\strut\textcolor{mutedgray}{#3}}
    \par\vspace{0.82mm}
}

\setlength{\parindent}{0pt}
\setlength{\parskip}{0pt}
\setlist[itemize]{leftmargin=1.1em,topsep=0.3mm,itemsep=0.35mm,parsep=0pt}
\setlist[enumerate]{leftmargin=1.6em,topsep=0.5mm,itemsep=0.35mm,parsep=0pt}
\sloppy

\begin{document}

\begin{center}
{\huge\textbf{${tex(profileCn.name)}}}\\
\vspace{1.2mm}
\textbf{邮箱：} \href{mailto:${href(siteData.profile.email)}}{${tex(siteData.profile.email)}}\hspace{5mm}
\textbf{主页：} \href{${href(HOMEPAGE_URL)}}{${tex(HOMEPAGE_URL)}}\hspace{5mm}
\textbf{Google Scholar：} \href{${href(SCHOLAR_URL)}}{${tex(siteData.profile.scholarStats.citations)} 次引用}
\end{center}
\vspace{-0.4mm}

\sectiontitle{研究方向}
{\small ${tex(profileCn.bio)}\par}
\begin{enumerate}[label=(\arabic*)]
${profileCn.interests.map(formatInterestItem).join("\n")}
\end{enumerate}

\sectiontitle{教育经历}
${formatEducation()}

\sectiontitle{论文发表 {\normalfont\small ($^{\ast}$ 表示共同一作；$^{\dagger}$ 表示通讯作者)}}
${publicationSections.map(formatPublicationSection).join("\n")}

\sectiontitle{代表项目}
${siteData.projects.map(formatProject).join("\n")}

\sectiontitle{荣誉与奖励}
${siteData.awards.map(formatAward).join("\n")}

\sectiontitle{学术服务}
${cvServices.map(formatService).join("\n")}

\end{document}
`;

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function main() {
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${cv}\n`);
  console.log(`Generated ${outputPath}`);
}

function formatInterestItem(interest: { title: string; description: string }) {
  return `\\item {\\small\\textbf{${tex(interest.title)}}：${tex(interest.description)}}`;
}

function formatEducation() {
  return [
    "\\educationentry{\\textbf{北京大学}}{2024.09 - 至今}{软件与微电子学院 · 软件工程硕士}{    {\\small 关注医疗健康 AI、医疗大语言模型与时序电子病历数据建模研究，导师为马连韬教授和王亚沙教授。\\par}}",
    "\\educationentry{\\textbf{北京航空航天大学}}{2019.09 - 2024.06}{软件学院 · 软件工程学士}{    {\\small GPA：3.83（排名：9/187，前 5\\%）。\\par}}",
  ].join("\n");
}

function formatPublicationSection(section: (typeof publicationSections)[number]) {
  const prefix = section.pageBreakBefore ? "\\pagebreak\n" : "";
  const entries = section.publications
    .map((item) =>
      formatPublication(item.uid, {
        label: item.label,
        title: "title" in item ? item.title : undefined,
        authors: "authors" in item ? item.authors : undefined,
        firstAuthors: "firstAuthors" in item ? item.firstAuthors : undefined,
        authorMode: section.authorMode,
      }),
    )
    .join("\n");

  return `${prefix}\\pubcategorytitle{${section.title}}\n${entries}`;
}

function formatPublication(
  uid: string,
  options: {
    label: string;
    title?: string;
    authors?: string;
    firstAuthors?: string;
    authorMode: "full" | "coauthors";
  },
) {
  const publication = getPublication(uid);
  const paperUrl = getPaperUrl(publication.links);
  const titleText = options.title ?? publication.title;
  const title = paperUrl
    ? `\\begingroup\\hypersetup{hidelinks}\\href{${href(paperUrl)}}{${tex(titleText)}}\\endgroup`
    : tex(titleText);
  const authors =
    options.authorMode === "coauthors"
      ? "Co-authors"
      : formatAuthors({
          authors: options.authors ?? publication.authors,
          firstAuthors: options.firstAuthors ?? publication.firstAuthors,
          correspondingAuthors: publication.correspondingAuthors,
        });
  const venue = stripYear(publication.venue, publication.year);

  return `\\pubentry{[${options.label}]}
{${title}}
{${authors}}
{${tex(venue)}}
{${tex(publication.year)}}`;
}

function getPublication(uid: string) {
  const publication = publicationsByUid.get(uid);

  if (!publication) {
    throw new Error(`Publication not found: ${uid}`);
  }

  return publication;
}

function formatProject(project: Project) {
  if (project.uid === "project-aicare") {
    const projectUrl = getPaperUrl(project.links);
    const title = `小雅医生（AICare）：面向电子健康记录分析的 AI 临床决策支持平台`;
    const linkedTitle = projectUrl
      ? `\\href{${href(projectUrl)}}{${tex(title)}}`
      : tex(title);

    return `\\cvitem{${linkedTitle}}{, \\cvdetail{部署于北京大学 Xplore “临床医学 + X” 平台}}{${tex(project.year)}}`;
  }

  const projectUrl = getPaperUrl(project.links);
  const title = projectUrl
    ? `\\href{${href(projectUrl)}}{${tex(project.title)}}`
    : tex(project.title);
  const venue = project.venue ? `, \\cvdetail{${tex(project.venue)}}` : "";

  return `\\cvitem{${title}}{${venue}}{${tex(project.year)}}`;
}

function formatAward(item: AwardItem) {
  const titleMap: Record<string, string> = {
    "Outstanding Graduate of Beihang University": "北京航空航天大学优秀毕业生",
    "National Encouragement Scholarship": "国家励志奖学金",
  };
  const organizationMap: Record<string, string> = {
    "Beihang University": "北京航空航天大学",
  };
  const title = titleMap[item.title] ?? item.title;
  const organization = item.organization
    ? `, \\cvdetail{${tex(organizationMap[item.organization] ?? item.organization)}}`
    : "";

  return `\\cvitem{${tex(title)}}{${organization}}{${tex(item.year)}}`;
}

function formatService(item: ServiceItem) {
  const titleMap: Record<string, string> = {
    Reviewer: "审稿人",
  };
  const organization = item.organization
    ? `, \\cvdetail{${tex(item.organization)}}`
    : "";

  return `\\cvitem{${tex(titleMap[item.title] ?? item.title)}}{${organization}}{${tex(item.year)}}`;
}

function mergeCvServices(services: ServiceItem[]) {
  const serviceGroups = new Map<string, ServiceItem[]>();

  services
    .filter((service) => service.title !== "Teaching Assistant")
    .forEach((service) => {
      const groupKey = [
        service.title,
        stripTrailingYear(service.organization).toLowerCase(),
      ].join("::");
      const group = serviceGroups.get(groupKey) ?? [];
      group.push(service);
      serviceGroups.set(groupKey, group);
    });

  return [...serviceGroups.values()].map((group) => ({
    ...group[0],
    organization: formatMergedOrganizations(group),
    year: uniqueValues(group.map((service) => service.year)).join(", "),
  }));
}

function formatMergedOrganizations(services: ServiceItem[]) {
  const organizations = uniqueValues(
    services.map((service) => service.organization),
  );

  if (organizations.length === 1) {
    return organizations[0] ?? "";
  }

  const baseOrganization = stripTrailingYear(organizations[0]);
  const years = organizations
    .map((organization) => organization.match(/\b(\d{4})$/)?.[1] ?? "")
    .filter(Boolean);

  if (
    baseOrganization &&
    years.length === organizations.length &&
    organizations.every(
      (organization) => stripTrailingYear(organization) === baseOrganization,
    )
  ) {
    return `${baseOrganization} ${years.join(", ")}`;
  }

  return organizations.join(", ");
}

function uniqueValues(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function stripTrailingYear(value = "") {
  return value.replace(/\s+\d{4}$/, "").trim();
}

function formatAuthors({
  authors,
  firstAuthors = "",
  correspondingAuthors = "",
}: {
  authors: string;
  firstAuthors?: string;
  correspondingAuthors?: string;
}) {
  const authorList = splitAuthors(authors);
  const firstAuthorList = splitAuthors(firstAuthors);
  const correspondingAuthorList = splitAuthors(correspondingAuthors);
  const hasCoFirstAuthors = firstAuthorList.length > 1;

  return authorList
    .map((author) => {
      let formatted =
        author === siteData.profile.name ? `\\textbf{${tex(author)}}` : tex(author);

      if (hasCoFirstAuthors && firstAuthorList.includes(author)) {
        formatted += "$^{\\ast}$";
      }

      if (correspondingAuthorList.includes(author)) {
        formatted += "$^{\\dagger}$";
      }

      return formatted;
    })
    .join(", ");
}

function splitAuthors(value = "") {
  return value
    .split(/,\s*/)
    .map((author) => author.trim())
    .filter(Boolean);
}

function getPaperUrl(links: LinkItem[]) {
  return (
    links.find((link) => link.type.toLowerCase() === "paper")?.url ??
    links.find((link) => link.type.toLowerCase() === "platform")?.url ??
    links.find((link) => link.type.toLowerCase() === "website")?.url ??
    links[0]?.url ??
    ""
  );
}

function stripYear(venue = "", year = "") {
  return venue
    .replace(new RegExp(`,?\\s*${escapeRegExp(year)}\\s*$`), "")
    .trim();
}

function tex(value: unknown = "") {
  return String(value)
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/{/g, "\\{")
    .replace(/}/g, "\\}")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}");
}

function href(value = "") {
  return value
    .replace(/\\/g, "/")
    .replace(/%/g, "\\%")
    .replace(/#/g, "\\#")
    .replace(/&/g, "\\&")
    .replace(/{/g, "\\{")
    .replace(/}/g, "\\}");
}

function escapeRegExp(value = "") {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
