const db = require('../models/db');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.newProject = async (req, res) => {
    const { project_title, member_id, development_type, advisor, school_year, chairman, id_expert } = req.body;

    try {
        if (!member_id) {
            return res.status(400).json({ error: 'member_id is required' });
        }

        const newProject = await db.project.create({
            data: {
                project_title,
                member: {
                    connect: { member_id: member_id }
                },
                development_type,
                advisor,
                school_year,
                chairman,
                id_expert // Now using id_expert instead of expert
            }
        });

        res.status(201).json(newProject);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Failed to create project', details: error.message });
    }
};

// Function to create a new project (admin version)
exports.newProjectAdmin = async (req, res) => {
    const { project_title, member_id, development_type, id_advisor, school_year, id_chairman, id_expert } = req.body;

    try {
        const idExpertInt = parseInt(id_expert, 10);
        const idAdvisor = parseInt(id_advisor, 10);
        const idChairman = parseInt(id_chairman, 10);
        const newProject = await db.project.create({
            data: {
                project_title,
                development_type,
                id_advisor:idAdvisor ,
                school_year,
                id_chairman: idChairman,
                id_expert: idExpertInt, // Now using id_expert
                ...(member_id && {
                    member: {
                        connect: { member_id: member_id }
                    }
                })
            }
        });

        res.status(201).json(newProject);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Failed to create project', details: error.message });
    }
};

// Function to update a project
exports.updateProject = async (req, res) => {
    const { id_project, project_title, member_id, development_type, id_advisor, school_year, id_chairman, id_expert } = req.body;

    try {
        if (!id_project) {
            return res.status(400).json({ error: 'Project ID is required' });
        }

        const projectId = parseInt(id_project, 10);
        if (isNaN(projectId)) {
            return res.status(400).json({ error: 'Invalid project ID' });
        }

        const existingProject = await db.project.findUnique({
            where: { id_project: projectId },
            include: { member: true, Doc: true }
        });

        if (!existingProject) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Convert id_expert to a number if it's provided
        const expertId = id_expert ? parseInt(id_expert, 10) : undefined;
        if (id_expert && isNaN(expertId)) {
            return res.status(400).json({ error: 'Invalid expert ID' });
        }

        const advisor = id_advisor ? parseInt(id_advisor, 10) : undefined;
        if (id_advisor && isNaN(advisor)) {
            return res.status(400).json({ error: 'Invalid expert ID' });
        }

        const chairman = id_chairman ? parseInt(id_chairman, 10) : undefined;
        if (id_chairman && isNaN(chairman)) {
            return res.status(400).json({ error: 'Invalid expert ID' });
        }

        const updatedProject = await db.project.update({
            where: { id_project: projectId },
            data: {
                project_title: project_title || existingProject.project_title,
                development_type: development_type || existingProject.development_type,
                id_advisor: advisor || existingProject.advisor,
                school_year: school_year || existingProject.school_year,
                id_chairman: chairman || existingProject.chairman,
                id_expert: expertId !== undefined ? expertId : existingProject.id_expert,
                member: member_id ? {
                    connect: { member_id: member_id }
                } : undefined
            }
        });

        res.status(200).json(updatedProject);
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Failed to update project', details: error.message });
    }
};


  exports.getAllProjects = async (req, res) => {
    try {
        const allProjects = await db.project.findMany({
            include: {
                member: true, // ถ้าคุณต้องการดึงข้อมูลของ member ที่สัมพันธ์กัน
                Doc: true     // ถ้าคุณต้องการดึงข้อมูลจากตาราง Doc ที่สัมพันธ์กัน
            }
        });

        res.status(200).json(allProjects);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve projects', details: error.message });
    }
};

// ฟังก์ชันใหม่สำหรับแสดงข้อมูล Project โดยใช้ id_project
exports.getProjectById = async (req, res) => {
    const { id_project } = req.params;

    try {
        const project = await db.project.findUnique({
            where: { id_project: parseInt(id_project) },
            include: {
                member: true, // ดึงข้อมูลของ member ที่สัมพันธ์กัน
                Doc: true     // ดึงข้อมูลจากตาราง Doc ที่สัมพันธ์กัน
            }
        });

        if (project) {
            res.status(200).json(project);
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve project', details: error.message });
    }
};

// ฟังก์ชันใหม่สำหรับแสดงข้อมูลโปรเจกต์ตาม member_id
exports.getProjectsByMemberId = async (req, res) => {
    const { member_id } = req.params;

    try {
        const projects = await db.project.findMany({
            where: { member_id: parseInt(member_id) },
            include: {
                member: true, // ดึงข้อมูลของ member ที่สัมพันธ์กัน
                Doc: true     // ดึงข้อมูลจากตาราง Doc ที่สัมพันธ์กัน
            }
        });

        if (projects.length > 0) {
            res.status(200).json(projects);
        } else {
            res.status(404).json({ error: 'No projects found for this member' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve projects', details: error.message });
    }
};

exports.deleteProject = async (req, res) => {
    const { id_project } = req.params;

    try {
        // แปลง id_project ให้เป็นตัวเลข
        const projectId = parseInt(id_project, 10);
        
        if (isNaN(projectId)) {
            return res.status(400).json({ error: 'Invalid project ID' });
        }

        // ดึงข้อมูลโปรเจกต์ที่ต้องการลบ
        const project = await db.project.findUnique({
            where: { id_project: projectId },
            include: { Doc: true } // ดึงข้อมูลเอกสารที่เกี่ยวข้อง
        });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // ลบไฟล์ที่เกี่ยวข้อง
        if (project.Doc && project.Doc.length > 0) {
            project.Doc.forEach(doc => {
                const fileName = doc.file_name;
                if (fileName) { // ตรวจสอบว่า fileName ไม่เป็น undefined หรือ null
                    const filePath = path.join(__dirname, '../uploads/docs/', fileName);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                }
            });
        }

        // ลบโปรเจกต์ออกจากฐานข้อมูล
        await db.project.delete({
            where: { id_project: projectId }
        });

        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Failed to delete project', details: error.message });
    }
};


exports.generateProjectReportByType = async (req, res) => {
    try {
        const { type, year } = req.query;

        const whereCondition = {
            ...(type && { development_type: type }), // กรองตามประเภท
            ...(year && { school_year: year }) // กรองตามปีที่เลือก
        };

        const reportDir = path.join(__dirname, '../uploads/reports');

        if (!fs.existsSync(reportDir)) {
            fs.mkdirSync(reportDir, { recursive: true });
        }

        const fileName = type ? `รายงานโปรเจค_${type}_${year || 'ทั้งหมด'}.pdf` : `รายงานโปรเจคทั้งหมด_${year || 'ทั้งหมด'}.pdf`;
        const filePath = path.join(reportDir, fileName);

        const projects = await db.project.findMany({
            where: whereCondition,
            include: {
                Creator: true,
                member: true,
                Doc: true,
                expert: true,
                advisor: true,
                chairman: true, 
            },
        });

        if (projects.length === 0) {
            return res.status(404).json({ error: type ? `No projects found for type ${type} in year ${year}` : `No projects found for year ${year}` });
        }

        const doc = new PDFDocument({ layout: 'landscape' });
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        const fontPath = path.join(__dirname, '../fonts/THSarabun.ttf');

        if (fs.existsSync(fontPath)) {
            doc.registerFont('THSarabun', fontPath);
            doc.font('THSarabun');
        } else {
            console.error('Font file not found:', fontPath);
            return res.status(500).json({ error: 'Font file not found' });
        }

        const itemHeight = 70;
        const tableWidth = 0; 
        const columnWidths = [100, 60, 100, 70, 100, 100, 100, 0]; 
        const tableHeader = ['ชื่อโครงงาน', 'ประเภทการพัฒนา', 'ผู้แต่ง', 'รหัสนักศึกษา', 'ที่ปรึกษา', 'ประธาน', 'ผู้ทรงคุณวุฒิ', 'ปีที่จัดทำ'];

        let isFirstPage = true;

        const addTableHeader = (y) => {
            doc.fontSize(12);
            doc.rect(50, y, doc.page.width - 100, itemHeight).stroke(); // Adjust table width
            columnWidths.forEach((width, index) => {
                doc.rect(50 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0), y, width, itemHeight).stroke();
            });
            tableHeader.forEach((text, index) => {
                doc.text(text, 50 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0) + 5, y + 5, {
                    width: columnWidths[index] - 10,
                    align: 'left',
                });
            });
        };

        const addNewPage = () => {
            if (isFirstPage) {
                doc.fontSize(20).text(`รายงานโครงงานประเภท: ${type || 'ทั้งหมด'} ปี: ${year || 'ทั้งหมด'}`, { align: 'center' }).moveDown(2);
                isFirstPage = false;
            } else {
                doc.addPage({ layout: 'landscape' });
            }
            return doc.y + 20;
        };

        let y = addNewPage();

        addTableHeader(y);
        y += itemHeight;

        for (const project of projects) {
            const expert = project.expert;
            const advisor = project.advisor;
            const chairman = project.chairman;

            const expertName = expert ? `${expert.expert_title}${expert.expert_name} ${expert.expert_lastname}`.trim() : ''; 
            const advisorName = advisor ? `${advisor.advisor_title || ''} ${advisor.advisor_name || ''} ${advisor.advisor_lastname || ''}`.trim() : '';
            const chairmanName = chairman ? `${chairman.chairman_title || ''} ${chairman.chairman_name || ''} ${chairman.chairman_lastname || ''}`.trim() : '';            
            const creatorNames = project.Creator.map(creator => creator.creator).join('\n');
            const IdStudent = project.Creator.map(creator => creator.id_student).join('\n');

            const row = [
                project.project_title || '',
                project.development_type || '',
                creatorNames || '',
                IdStudent || '',
                advisorName || '',
                chairmanName || '',
                expertName || '',
                project.school_year || '',
            ];

            if (y + itemHeight > doc.page.height - doc.page.margins.bottom - 100) {
                y = addNewPage();
                addTableHeader(y);
                y += itemHeight;
            }

            doc.rect(50, y, doc.page.width - 100, itemHeight).stroke(); // Adjust table width
            columnWidths.forEach((width, index) => {
                doc.rect(50 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0), y, width, itemHeight).stroke();
            });

            row.forEach((text, index) => {
                doc.text(text, 50 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0) + 5, y + 5, {
                    width: columnWidths[index] - 10,
                    align: 'left',
                });
            });

            y += itemHeight;
        }

        // แถวสำหรับจำนวนโครงงานทั้งหมด
        if (y + itemHeight > doc.page.height - doc.page.margins.bottom - 100) {
            y = addNewPage();
            addTableHeader(y);
            y += itemHeight;
        }

        // เพิ่มแถวจำนวนโครงงานทั้งหมด
        doc.rect(50, y, doc.page.width - 100, itemHeight).stroke(); // กรอบสี่เหลี่ยมเต็มความกว้าง
        doc.text(`จำนวนโครงงานทั้งหมด: ${projects.length} เล่ม`, 60, y + 25, {
            width: doc.page.width - 100,
            align: 'center',
        });

        doc.end();

        stream.on('finish', () => {
            res.download(filePath);
        });

    } catch (error) {
        console.error('Error generating project report by type:', error);
        res.status(500).json({ error: 'Failed to generate project report by type', details: error.message });
    }
};



// ใช้ยิงข้อมูลไปหน้า dash-board
exports.getTotalProjectCount = async (req, res) => {
    try {
        const projectCount = await db.project.count();
        res.status(200).json({ totalProjects: projectCount });
    } catch (error) {
        console.error('Error counting projects:', error);
        res.status(500).json({ error: 'Failed to count projects', details: error.message });
    }
};

exports.getProjectTypeCounts = async (req, res) => {
    try {
        const projectTypes = [
            'การพัฒนาเว็บ',
            'การพัฒนาแอปมือถือ',
            'การพัฒนาซอฟต์แวร์',
            'การวิเคราะห์ข้อมูล',
            'การพัฒนา AI'
        ];

        const typeCounts = await db.project.groupBy({
            by: ['development_type'],
            _count: {
                development_type: true
            }
        });

        const result = projectTypes.map(type => {
            const countObj = typeCounts.find(tc => tc.development_type === type);
            return {
                type,
                count: countObj ? countObj._count.development_type : 0
            };
        });

        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching project type counts:', error);
        res.status(500).json({ error: 'Failed to retrieve project type counts', details: error.message });
    }
};


// ฟังก์ชันใหม่สำหรับดึงข้อมูลจำนวนโปรเจคตามปีการศึกษาและประเภทการพัฒนา
exports.getProjectCountsByYear = async (req, res) => {
    try {
        // ดึงข้อมูลจำนวนโปรเจคตามปีการศึกษาและประเภทการพัฒนา
        const projectCounts = await db.project.groupBy({
            by: ['school_year', 'development_type'],
            _count: {
                id_project: true
            }
        });

        // รูปแบบผลลัพธ์เป็น { school_year: { type: count } }
        const result = projectCounts.reduce((acc, project) => {
            const { school_year, development_type, _count } = project;
            if (!acc[school_year]) {
                acc[school_year] = {};
            }
            acc[school_year][development_type] = _count.id_project;
            return acc;
        }, {});

        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching project counts by year:', error);
        res.status(500).json({ error: 'Failed to retrieve project counts by year', details: error.message });
    }
};