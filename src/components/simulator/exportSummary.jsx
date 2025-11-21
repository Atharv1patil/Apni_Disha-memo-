import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";

export default async function exportSummary({
  scenarios = [],
  STREAMS = [],
  COURSES = {},
  COLLEGE_TYPES = [],
  COLLEGES = {},
  SKILLS = [],
  UPSKILLS = [],
  SCHOLARSHIPS = [],
  i18n = { language: 'en' },
  t = (key) => key,
  currency = (val) => `₹${val?.toLocaleString() || '0'}`,
  getLabel = (item, lang) => item?.label || item?.name || '-',
}) {
  // Validation
  if (!scenarios || scenarios.length === 0) {
    console.warn("No scenarios provided for export.");
    alert("No scenarios to export. Please add at least one scenario.");
    return;
  }

  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "A4",
    });

    // Design Constants
    const COLORS = {
      primary: [56, 90, 190],
      secondary: [99, 102, 241],
      success: [16, 185, 129],
      warning: [245, 158, 11],
      danger: [239, 68, 68],
      lightBg: [248, 250, 252],
      cardBg: [255, 255, 255],
      darkText: [30, 41, 59],
      lightText: [100, 116, 139],
      border: [226, 232, 240],
    };

    const MARGIN = 40;
    const PAGE_WIDTH = doc.internal.pageSize.width;
    const PAGE_HEIGHT = doc.internal.pageSize.height;
    const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN * 2);

    let currentY = MARGIN;

    // Helper Functions
    const addPage = () => {
      doc.addPage();
      currentY = MARGIN;
    };

    const checkPageBreak = (requiredSpace = 100) => {
      if (currentY + requiredSpace > PAGE_HEIGHT - MARGIN) {
        addPage();
        return true;
      }
      return false;
    };

    const safeGetLabel = (items, id, lang) => {
      try {
        const item = items?.find(i => i?.id === id);
        return getLabel(item, lang) || '-';
      } catch (e) {
        return '-';
      }
    };

    const safeGetCourse = (stream, courseId, lang) => {
      try {
        const courses = COURSES[stream] || [];
        const course = courses.find(c => c?.id === courseId);
        return getLabel(course, lang) || '-';
      } catch (e) {
        return '-';
      }
    };

    const safeGetCollege = (collegeType, collegeId, lang) => {
      try {
        const colleges = COLLEGES[collegeType] || [];
        const college = colleges.find(c => c?.id === collegeId);
        return getLabel(college, lang) || '-';
      } catch (e) {
        return '-';
      }
    };

    // Add icon symbols using standard characters
    const ICONS = {
      education: ">>",
      finance: "$",
      skills: "*",
      career: "^",
      scholarship: "+",
      checkmark: ">",
      bullet: "-",
    };

    // ===== COVER PAGE =====
    const drawCoverPage = () => {
      // Top gradient section
      doc.setFillColor(...COLORS.primary);
      doc.rect(0, 0, PAGE_WIDTH, 200, 'F');
      
      doc.setFillColor(70, 100, 200);
      doc.rect(0, 200, PAGE_WIDTH, 200, 'F');

      // Title section with white background
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(MARGIN, 150, CONTENT_WIDTH, 180, 10, 10, 'F');
      
      doc.setTextColor(...COLORS.primary);
      doc.setFontSize(36);
      doc.setFont("helvetica", "bold");
      doc.text("Career Analysis Report", PAGE_WIDTH / 2, 220, { align: "center" });
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...COLORS.lightText);
      doc.text(`${scenarios.length} Career ${scenarios.length === 1 ? 'Path' : 'Paths'} Analyzed`, PAGE_WIDTH / 2, 260, { align: "center" });
      
      doc.setFontSize(11);
      doc.text(`Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, PAGE_WIDTH / 2, 290, { align: "center" });

      // Bottom section
      doc.setFontSize(12);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(...COLORS.darkText);
      doc.text("Your Future, Your Choice", PAGE_WIDTH / 2, PAGE_HEIGHT - 60, { align: "center" });
    };

    drawCoverPage();

    // ===== EXECUTIVE SUMMARY PAGE =====
    addPage();
    
    // Header with solid background
    doc.setFillColor(...COLORS.primary);
    doc.rect(0, 0, PAGE_WIDTH, 60, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("Executive Summary", PAGE_WIDTH / 2, 40, { align: "center" });
    
    currentY = 90;

    // Summary text
    doc.setTextColor(...COLORS.darkText);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const summaryText = `This report analyzes ${scenarios.length} career ${scenarios.length === 1 ? 'path' : 'paths'} to help you make an informed decision about your future. Each scenario has been evaluated based on educational choices, financial outcomes, employment prospects, and skill development opportunities.`;
    const splitSummary = doc.splitTextToSize(summaryText, CONTENT_WIDTH - 20);
    doc.text(splitSummary, MARGIN + 10, currentY);
    currentY += (splitSummary.length * 14) + 30;

    // Key Stats Cards - Improved with borders
    const avgROI = scenarios.reduce((acc, s) => acc + (s.roi || 0), 0) / scenarios.length;
    const maxROI = Math.max(...scenarios.map(s => s.roi || 0));
    
    const stats = [
      { label: "Total Scenarios", value: scenarios.length, color: COLORS.primary },
      { label: "Avg ROI", value: `${avgROI.toFixed(1)}%`, color: COLORS.success },
      { label: "Highest ROI", value: `${maxROI.toFixed(1)}%`, color: COLORS.warning },
    ];

    const cardWidth = (CONTENT_WIDTH - 40) / 3;
    stats.forEach((stat, idx) => {
      const x = MARGIN + (idx * (cardWidth + 20));
      
      // Card background with shadow effect
      doc.setFillColor(240, 240, 245);
      doc.roundedRect(x + 2, currentY + 2, cardWidth, 80, 8, 8, 'F');
      
      doc.setFillColor(...stat.color);
      doc.roundedRect(x, currentY, cardWidth, 80, 8, 8, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(stat.label, x + cardWidth / 2, currentY + 30, { align: "center" });
      
      doc.setFontSize(28);
      doc.setFont("helvetica", "bold");
      doc.text(String(stat.value), x + cardWidth / 2, currentY + 60, { align: "center" });
    });
    currentY += 110;

    // What's Inside section
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLORS.darkText);
    doc.text("What's Inside:", MARGIN, currentY);
    currentY += 30;

    const sections = [
      "Detailed breakdown of each career path",
      "Financial analysis including ROI and NPV",
      "Skills and upskilling recommendations",
      "Visual comparison charts",
      "Personalized insights and recommendations"
    ];

    doc.setFillColor(...COLORS.lightBg);
    doc.roundedRect(MARGIN, currentY - 10, CONTENT_WIDTH, (sections.length * 25) + 20, 5, 5, 'F');

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.darkText);
    
    sections.forEach((section, idx) => {
      // Bullet point
      doc.setFillColor(...COLORS.primary);
      doc.circle(MARGIN + 20, currentY + 5, 3, 'F');
      
      doc.text(section, MARGIN + 35, currentY + 8);
      currentY += 25;
    });

    currentY += 10;

    // ===== INDIVIDUAL SCENARIO PAGES =====
    scenarios.forEach((scenario, index) => {
      addPage();

      // Scenario Header with number badge
      doc.setFillColor(...COLORS.primary);
      doc.rect(0, 0, PAGE_WIDTH, 80, 'F');
      
      // Scenario number badge
      doc.setFillColor(255, 255, 255);
      doc.circle(MARGIN + 25, 40, 25, 'F');
      doc.setTextColor(...COLORS.primary);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text(`${index + 1}`, MARGIN + 25, 48, { align: "center" });
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.text(scenario.name || `Career Path ${index + 1}`, MARGIN + 65, 48);

      currentY = 100;

      // Educational Path Section
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(...COLORS.border);
      doc.setLineWidth(1);
      doc.roundedRect(MARGIN, currentY, CONTENT_WIDTH, 160, 8, 8, 'FD');
      
      // Section header
      doc.setFillColor(...COLORS.primary);
      doc.roundedRect(MARGIN, currentY, CONTENT_WIDTH, 40, 8, 8, 'F');
      doc.rect(MARGIN, currentY + 32, CONTENT_WIDTH, 8, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("EDUCATIONAL PATH", MARGIN + 15, currentY + 26);

      const eduDetails = [
        { label: "Stream", value: safeGetLabel(STREAMS, scenario.stream, i18n.language) },
        { label: "Course", value: safeGetCourse(scenario.stream, scenario.course, i18n.language) },
        { label: "College Type", value: safeGetLabel(COLLEGE_TYPES, scenario.collegeType, i18n.language) },
        { label: "College", value: safeGetCollege(scenario.collegeType, scenario.college, i18n.language) },
      ];

      doc.setTextColor(...COLORS.darkText);
      
      let eduY = currentY + 60;
      eduDetails.forEach((detail, idx) => {
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...COLORS.lightText);
        doc.text(`${detail.label}:`, MARGIN + 20, eduY);
        
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...COLORS.darkText);
        const valueText = doc.splitTextToSize(detail.value, CONTENT_WIDTH - 140);
        doc.text(valueText, MARGIN + 130, eduY);
        eduY += 25;
      });

      currentY += 175;

      // Financial Overview Section
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(...COLORS.border);
      doc.roundedRect(MARGIN, currentY, CONTENT_WIDTH, 120, 8, 8, 'FD');
      
      doc.setFillColor(254, 243, 199);
      doc.roundedRect(MARGIN, currentY, CONTENT_WIDTH, 40, 8, 8, 'F');
      doc.rect(MARGIN, currentY + 32, CONTENT_WIDTH, 8, 'F');
      
      doc.setTextColor(...COLORS.warning);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("FINANCIAL OVERVIEW", MARGIN + 15, currentY + 26);

      const financialMetrics = [
        { 
          label: "ROI", 
          value: scenario.roi !== undefined && scenario.roi !== null ? `${scenario.roi}%` : 'Not Available',
          x: MARGIN + 40,
        },
        { 
          label: "NPV", 
          value: scenario.npv ? currency(scenario.npv) : 'Not Available',
          x: MARGIN + 200,
        },
        { 
          label: "Starting Salary", 
          value: scenario.startingSalary ? currency(scenario.startingSalary) : 'Not Available',
          x: MARGIN + 380,
        }
      ];

      const metricY = currentY + 70;
      financialMetrics.forEach(metric => {
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...COLORS.lightText);
        doc.text(metric.label, metric.x, metricY);
        
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...COLORS.darkText);
        const valueLines = doc.splitTextToSize(metric.value, 140);
        doc.text(valueLines, metric.x, metricY + 20);
      });

      currentY += 135;

      // Skills & Development Section
      checkPageBreak(130);
      
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(...COLORS.border);
      doc.roundedRect(MARGIN, currentY, CONTENT_WIDTH, 120, 8, 8, 'FD');
      
      doc.setFillColor(220, 252, 231);
      doc.roundedRect(MARGIN, currentY, CONTENT_WIDTH, 40, 8, 8, 'F');
      doc.rect(MARGIN, currentY + 32, CONTENT_WIDTH, 8, 'F');
      
      doc.setTextColor(...COLORS.success);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("SKILLS & DEVELOPMENT", MARGIN + 15, currentY + 26);

      doc.setFontSize(10);
      doc.setTextColor(...COLORS.darkText);

      const skills = (scenario.skills || [])
        .map(sk => safeGetLabel(SKILLS, sk, i18n.language))
        .filter(s => s !== '-')
        .join(", ") || "No specific skills listed";
      
      const upskills = (scenario.upskill || [])
        .map(u => safeGetLabel(UPSKILLS, u, i18n.language))
        .filter(u => u !== '-')
        .join(", ") || "No upskilling recommended";

      doc.setFont("helvetica", "bold");
      doc.setTextColor(...COLORS.lightText);
      doc.text("Core Skills:", MARGIN + 20, currentY + 60);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...COLORS.darkText);
      const skillsText = doc.splitTextToSize(skills, CONTENT_WIDTH - 50);
      doc.text(skillsText, MARGIN + 20, currentY + 76);

      const upskillY = currentY + 76 + (skillsText.length * 12) + 10;
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...COLORS.lightText);
      doc.text("Upskilling:", MARGIN + 20, upskillY);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...COLORS.darkText);
      const upskillText = doc.splitTextToSize(upskills, CONTENT_WIDTH - 50);
      doc.text(upskillText, MARGIN + 20, upskillY + 16);

      currentY += 135;

      // Career Prospects Section
      checkPageBreak(130);
      
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(...COLORS.border);
      doc.roundedRect(MARGIN, currentY, CONTENT_WIDTH, 100, 8, 8, 'FD');
      
      doc.setFillColor(224, 242, 254);
      doc.roundedRect(MARGIN, currentY, CONTENT_WIDTH, 40, 8, 8, 'F');
      doc.rect(MARGIN, currentY + 32, CONTENT_WIDTH, 8, 'F');
      
      doc.setTextColor(...COLORS.secondary);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("CAREER PROSPECTS", MARGIN + 15, currentY + 26);

      const careerMetrics = [
        { 
          label: "Employment Probability", 
          value: scenario.employmentProb ? `${(scenario.employmentProb * 100).toFixed(1)}%` : 'N/A',
          x: MARGIN + 40,
        },
        { 
          label: "Time to Job", 
          value: scenario.timeToJob ? `${scenario.timeToJob} months` : 'N/A',
          x: MARGIN + 230,
        },
        { 
          label: "Scholarship Odds", 
          value: scenario.scholarshipOdds ? `${(scenario.scholarshipOdds * 100).toFixed(1)}%` : 'N/A',
          x: MARGIN + 400,
        }
      ];

      const careerY = currentY + 65;
      careerMetrics.forEach(metric => {
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...COLORS.lightText);
        doc.text(metric.label, metric.x, careerY);
        
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...COLORS.darkText);
        doc.text(metric.value, metric.x, careerY + 20);
      });

      currentY += 115;

      // Scholarship Info (if available)
      if (scenario.scholarship) {
        checkPageBreak(70);
        const scholarshipName = safeGetLabel(SCHOLARSHIPS, scenario.scholarship, i18n.language);
        if (scholarshipName !== '-') {
          doc.setFillColor(255, 255, 255);
          doc.setDrawColor(219, 39, 119);
          doc.setLineWidth(2);
          doc.roundedRect(MARGIN, currentY, CONTENT_WIDTH, 55, 8, 8, 'FD');
          
          doc.setTextColor(219, 39, 119);
          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          doc.text("SCHOLARSHIP OPPORTUNITY", MARGIN + 15, currentY + 25);
          
          doc.setFontSize(11);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(...COLORS.darkText);
          doc.text(scholarshipName, MARGIN + 15, currentY + 42);
          
          currentY += 70;
        }
      }
    });

    // ===== COMPARISON PAGE =====
    addPage();

    // Comparison Header
    doc.setFillColor(...COLORS.primary);
    doc.rect(0, 0, PAGE_WIDTH, 80, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.text("Scenario Comparison", PAGE_WIDTH / 2, 50, { align: "center" });

    currentY = 110;

    // ROI Comparison Visual
    doc.setFillColor(...COLORS.lightBg);
    doc.roundedRect(MARGIN, currentY, CONTENT_WIDTH, 40, 5, 5, 'F');
    
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLORS.darkText);
    doc.text("Return on Investment (ROI) Rankings", MARGIN + 15, currentY + 26);
    currentY += 55;

    const validROIScenarios = scenarios
      .map((s, idx) => ({ ...s, originalIndex: idx }))
      .filter(s => s.roi !== undefined && s.roi !== null)
      .sort((a, b) => (b.roi || 0) - (a.roi || 0));

    if (validROIScenarios.length > 0) {
      const maxROI = Math.max(...validROIScenarios.map(s => s.roi || 0));
      const barMaxWidth = CONTENT_WIDTH - 200;

      validROIScenarios.forEach((s, idx) => {
        checkPageBreak(55);
        
        const barWidth = maxROI > 0 ? (s.roi / maxROI) * barMaxWidth : 0;
        const barColor = idx === 0 ? COLORS.success : idx === 1 ? COLORS.warning : COLORS.secondary;

        // Rank badge
        doc.setFillColor(...barColor);
        doc.circle(MARGIN + 15, currentY + 8, 12, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(`${idx + 1}`, MARGIN + 15, currentY + 12, { align: "center" });

        // Scenario name
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...COLORS.darkText);
        const scenarioLabel = (s.name || `Scenario ${s.originalIndex + 1}`).substring(0, 22);
        doc.text(scenarioLabel, MARGIN + 35, currentY + 12);

        // Bar background
        doc.setFillColor(240, 240, 245);
        doc.roundedRect(MARGIN + 170, currentY, barMaxWidth, 18, 4, 4, 'F');
        
        // Bar
        if (barWidth > 0) {
          doc.setFillColor(...barColor);
          doc.roundedRect(MARGIN + 170, currentY, barWidth, 18, 4, 4, 'F');
        }

        // ROI value
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...COLORS.darkText);
        doc.text(`${s.roi}%`, MARGIN + 175 + barMaxWidth, currentY + 12);

        currentY += 35;
      });

      currentY += 15;
    } else {
      doc.setFontSize(11);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(...COLORS.lightText);
      doc.text("No ROI data available for comparison", MARGIN + 15, currentY);
      currentY += 40;
    }

    // Quick Comparison Table
    checkPageBreak(200);
    
    doc.setFillColor(...COLORS.lightBg);
    doc.roundedRect(MARGIN, currentY, CONTENT_WIDTH, 40, 5, 5, 'F');
    
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLORS.darkText);
    doc.text("Detailed Comparison", MARGIN + 15, currentY + 26);
    currentY += 55;

    const tableHeaders = ["#", "Scenario Name", "ROI %", "Starting Salary", "Employment", "Time"];
    const tableRows = scenarios.map((s, i) => [
      `${i + 1}`,
      (s.name || `Scenario ${i + 1}`).substring(0, 28),
      s.roi !== undefined && s.roi !== null ? `${s.roi}%` : '-',
      s.startingSalary ? currency(s.startingSalary) : '-',
      s.employmentProb ? `${(s.employmentProb * 100).toFixed(0)}%` : '-',
      s.timeToJob ? `${s.timeToJob}m` : '-',
    ]);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableRows,
      startY: currentY,
      margin: { left: MARGIN, right: MARGIN },
      styles: {
        fontSize: 9,
        cellPadding: 10,
        overflow: 'linebreak',
        halign: 'left',
        lineColor: COLORS.border,
        lineWidth: 0.5,
      },
      headStyles: {
        fillColor: COLORS.primary,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center',
        fontSize: 10,
      },
      alternateRowStyles: {
        fillColor: COLORS.lightBg,
      },
      columnStyles: {
        0: { cellWidth: 30, halign: 'center', fontStyle: 'bold' },
        1: { cellWidth: 150 },
        2: { cellWidth: 50, halign: 'center' },
        3: { cellWidth: 90, halign: 'right' },
        4: { cellWidth: 70, halign: 'center' },
        5: { cellWidth: 50, halign: 'center' },
      },
    });

    currentY = doc.lastAutoTable.finalY + 40;

    // Recommendations Section
    checkPageBreak(180);
    
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...COLORS.primary);
    doc.setLineWidth(2);
    doc.roundedRect(MARGIN, currentY, CONTENT_WIDTH, 150, 8, 8, 'FD');
    
    doc.setFillColor(...COLORS.primary);
    doc.roundedRect(MARGIN, currentY, CONTENT_WIDTH, 45, 8, 8, 'F');
    doc.rect(MARGIN, currentY + 37, CONTENT_WIDTH, 8, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Our Recommendations", MARGIN + 15, currentY + 28);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.darkText);

    const recommendations = [
      "Consider scenarios with ROI above 50% for better returns",
      "Balance financial outcomes with personal interests",
      "Factor in employment probability and time to job",
      "Explore scholarship opportunities to reduce costs",
      "Consult with career counselors for personalized guidance"
    ];

    let recY = currentY + 65;
    recommendations.forEach(rec => {
      doc.setFillColor(...COLORS.primary);
      doc.circle(MARGIN + 25, recY - 3, 3, 'F');
      doc.text(rec, MARGIN + 40, recY);
      recY += 18;
    });

    // Final Footer Page
    addPage();
    currentY = PAGE_HEIGHT / 2 - 80;

    doc.setFillColor(...COLORS.primary);
    doc.roundedRect(MARGIN, currentY, CONTENT_WIDTH, 120, 10, 10, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("Your Future Starts Here", PAGE_WIDTH / 2, currentY + 50, { align: "center" });

    doc.setFontSize(13);
    doc.setFont("helvetica", "normal");
    doc.text("Make informed decisions. Choose your path wisely.", PAGE_WIDTH / 2, currentY + 80, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Generated by Career Pathfinder", PAGE_WIDTH / 2, currentY + 105, { align: "center" });

    // Save the PDF
    const fileName = `career_analysis_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    
    return { success: true, fileName };

  } catch (err) {
    console.error("PDF Export Error:", err);
    alert(`Failed to generate PDF: ${err.message || 'Unknown error'}. Please try again.`);
    return { success: false, error: err.message };
  }
}