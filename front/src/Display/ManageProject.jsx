import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function ManageProject() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, setError] = useState(null);
  const { member_id } = useParams();
  const [searchCriteria, setSearchCriteria] = useState({
    global_search: '',
    project_title: '',
    creator: '',
    id_student: '',
    advisor: '',
    development_type: '',
    school_year: '',
    chairman: '',
    expert: '',
  });
  const [selectedProjects, setSelectedProjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectResponse = await axios.get(`http://localhost:9999/project/member/${member_id}`);
        const creatorResponse = await axios.get(`http://localhost:9999/creator/getAll`);
        
        const creatorsByProject = creatorResponse.data.reduce((acc, creator) => {
          if (!acc[creator.id_project]) {
            acc[creator.id_project] = {
              names: [],
              ids: []
            };
          }
          acc[creator.id_project].names.push(creator.creator);
          acc[creator.id_project].ids.push(creator.id_student);
          return acc;
        }, {});

        const mergedData = projectResponse.data.map(project => {
          const projectCreators = creatorsByProject[project.id_project] || { names: [], ids: [] };
          return { 
            ...project, 
            creators: projectCreators.names.join('<br />'), 
            id_students: projectCreators.ids.join('<br />')
          };
        });
  
        setProjects(mergedData);
        setFilteredProjects(mergedData);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [member_id]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria({
      ...searchCriteria,
      [name]: value
    });
  };


  const filterProjects = () => {
    const filtered = projects.filter(project =>
      (searchCriteria.global_search === '' || 
       project.project_title.toLowerCase().includes(searchCriteria.global_search.toLowerCase()) ||
       project.creators.toLowerCase().includes(searchCriteria.global_search.toLowerCase()) ||
       project.id_students.toLowerCase().includes(searchCriteria.global_search.toLowerCase()) ||
       project.advisor.toLowerCase().includes(searchCriteria.global_search.toLowerCase()) ||
       project.development_type.toLowerCase().includes(searchCriteria.global_search.toLowerCase())||
       project.school_year.toLowerCase().includes(searchCriteria.global_search.toLowerCase()) ||
       project.chairman.toLowerCase().includes(searchCriteria.global_search.toLowerCase()) ||
       project.expert.toLowerCase().includes(searchCriteria.global_search.toLowerCase()))
      &&
      (project.project_title.toLowerCase().includes(searchCriteria.project_title.toLowerCase()) ||
       searchCriteria.project_title === '')
      &&
      (project.creators.toLowerCase().includes(searchCriteria.creator.toLowerCase()) ||
       searchCriteria.creator === '')
      &&
      (project.id_students.toLowerCase().includes(searchCriteria.id_student.toLowerCase()) ||
       searchCriteria.id_student === '')
      &&
      (project.advisor.toLowerCase().includes(searchCriteria.advisor.toLowerCase()) ||
       searchCriteria.advisor === '')
      &&
      (project.development_type.toLowerCase().includes(searchCriteria.development_type.toLowerCase()) ||
       searchCriteria.development_type === '')
       &&
       (project.school_year.toLowerCase().includes(searchCriteria.school_year.toLowerCase()) ||
        searchCriteria.school_year === '') 
        &&
       (project.chairman.toLowerCase().includes(searchCriteria.chairman.toLowerCase()) ||
        searchCriteria.chairman === '') 
        &&
       (project.expert.toLowerCase().includes(searchCriteria.expert.toLowerCase()) ||
        searchCriteria.expert === '') 
    );
    setFilteredProjects(filtered);
  };

  const handleSearchClick = () => {
    filterProjects();
  };

  const handleCheckboxChange = (projectId) => {
    setSelectedProjects((prevSelected) =>
      prevSelected.includes(projectId)
        ? prevSelected.filter(id => id !== projectId)
        : [...prevSelected, projectId]
    );
  };

  const handleDeleteSelected = async () => {
    const result = await Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: 'การลบจะไม่สามารถกู้คืนได้!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก'
    });
  
    if (result.isConfirmed) {
      try {
        await Promise.all(selectedProjects.map(id_project =>
          axios.delete(`http://localhost:9999/project/delete/${id_project}`)
        ));
        setProjects(projects.filter(project => !selectedProjects.includes(project.id_project)));
        setFilteredProjects(filteredProjects.filter(project => !selectedProjects.includes(project.id_project)));
        setSelectedProjects([]);
        Swal.fire(
          'ลบเรียบร้อย!',
          'ข้อมูลที่เลือกถูกลบออกแล้ว.',
          'success'
        );
      } catch (err) {
        Swal.fire(
          'เกิดข้อผิดพลาด!',
          'ไม่สามารถลบข้อมูลได้.',
          'error'
        );
      }
    }
  };

  const handleEditClick = () => {
    if (selectedProjects.length !== 1) {
      Swal.fire(
        'ไม่สามารถดำเนินการได้!',
        'กรุณาเลือกเพียงโครงงานเดียวเพื่อทำการแก้ไข.',
        'warning'
      );
    } else {
      navigate(`/edit-project/${selectedProjects[0]}`);
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <main className="mt-8 container mx-auto">
        <div className="mt-4 mb-6 flex items-center">
          <input
            type="text"
            name="global_search"
            value={searchCriteria.global_search}
            onChange={handleSearchChange}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm"
            placeholder="ค้นหาข้อมูลทั้งหมด"
          />
          <button
            onClick={handleSearchClick}
            className="bg-blue-500 text-white py-2 px-4 rounded-r-md shadow-sm hover:bg-blue-600"
          >
            ค้นหา
          </button>
        </div>

        <div className="mt-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ค้นหาตามหัวข้อโครงงาน</label>
              <input
                type="text"
                name="project_title"
                value={searchCriteria.project_title}
                onChange={handleSearchChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="ค้นหาตามหัวข้อโครงงาน"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ค้นหาตามผู้แต่ง</label>
              <input
                type="text"
                name="creator"
                value={searchCriteria.creator}
                onChange={handleSearchChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="ค้นหาตามผู้แต่ง"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ค้นหาตามรหัสนักศึกษา</label>
              <input
                type="text"
                name="id_student"
                value={searchCriteria.id_student}
                onChange={handleSearchChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="ค้นหาตามรหัสนักศึกษา"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ค้นหาตามที่ปรึกษาโครงงาน</label>
              <select
                name="advisor"
                value={searchCriteria.advisor}
                onChange={handleSearchChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              >
                <option value="">เลือกที่ปรึกษา</option>
                <option value="อาจารย์ภาสกร ธนศิระธรรม">อาจารย์ภาสกร ธนศิระธรรม</option>
                <option value="อาจารย์อิสรา ชื่นตา">อาจารย์อิสรา ชื่นตา</option>
                <option value="อาจารย์มณีรัตน์ ผลประเสริฐ">อาจารย์มณีรัตน์ ผลประเสริฐ</option>
                <option value="อาจารย์ชเนตตี พิมพ์สวรรค์">อาจารย์ชเนตตี พิมพ์สวรรค์</option>
                <option value="อาจารย์บัณฑิต สุวรรณโท">อาจารย์บัณฑิต สุวรรณโท</option>
                <option value="อาจารย์ดร.เดือนเพ็ญ ภานุรักษ์">อาจารย์ดร.เดือนเพ็ญ ภานุรักษ์</option>
                <option value="อาจารย์ดร.วีระพน ภานุรักษ์">อาจารย์ดร.วีระพน ภานุรักษ์</option>
                <option value="อาจารย์วินัย โกหลำ">อาจารย์วินัย โกหลำ</option>
                <option value="อาจารย์สมร เหล็กกล้า">อาจารย์สมร เหล็กกล้า</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="development_type">ประเภทการพัฒนา</label>
              <select
                name="development_type"
                value={searchCriteria.development_type}
                onChange={handleSearchChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              >
                <option value="">เลือกประเภทการพัฒนา</option>
                <option value="การพัฒนาเว็บ">การพัฒนาเว็บ</option>
                <option value="การพัฒนาแอปมือถือ">การพัฒนาแอปมือถือ</option>
                <option value="การพัฒนาซอฟต์แวร์">การพัฒนาซอฟต์แวร์</option>
                <option value="การวิเคราะห์ข้อมูล">การวิเคราะห์ข้อมูล</option>
                <option value="การพัฒนา AI">การพัฒนา AI</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ค้นหาประธาน</label>
              <select
                name="chairman"
                value={searchCriteria.chairman}
                onChange={handleSearchChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              >
                <option value="">เลือกประธาน</option>
                <option value="อาจารย์ภาสกร ธนศิระธรรม">อาจารย์ภาสกร ธนศิระธรรม</option>
                <option value="อาจารย์อิสรา ชื่นตา">อาจารย์อิสรา ชื่นตา</option>
                <option value="อาจารย์มณีรัตน์ ผลประเสริฐ">อาจารย์มณีรัตน์ ผลประเสริฐ</option>
                <option value="อาจารย์ชเนตตี พิมพ์สวรรค์">อาจารย์ชเนตตี พิมพ์สวรรค์</option>
                <option value="อาจารย์บัณฑิต สุวรรณโท">อาจารย์บัณฑิต สุวรรณโท</option>
                <option value="อาจารย์ดร.เดือนเพ็ญ ภานุรักษ์">อาจารย์ดร.เดือนเพ็ญ ภานุรักษ์</option>
                <option value="อาจารย์ดร.วีระพน ภานุรักษ์">อาจารย์ดร.วีระพน ภานุรักษ์</option>
                <option value="อาจารย์วินัย โกหลำ">อาจารย์วินัย โกหลำ</option>
                <option value="อาจารย์สมร เหล็กกล้า">อาจารย์สมร เหล็กกล้า</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ค้นหาผู้ทรงคุณวุฒิ</label>
              <select
                name="expert"
                value={searchCriteria.expert}
                onChange={handleSearchChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              >
                <option value="">เลือกผู้ทรงคุณวุฒิ</option>
                <option value="อาจารย์ภาสกร ธนศิระธรรม">อาจารย์ภาสกร ธนศิระธรรม</option>
                <option value="อาจารย์อิสรา ชื่นตา">อาจารย์อิสรา ชื่นตา</option>
                <option value="อาจารย์มณีรัตน์ ผลประเสริฐ">อาจารย์มณีรัตน์ ผลประเสริฐ</option>
                <option value="อาจารย์ชเนตตี พิมพ์สวรรค์">อาจารย์ชเนตตี พิมพ์สวรรค์</option>
                <option value="อาจารย์บัณฑิต สุวรรณโท">อาจารย์บัณฑิต สุวรรณโท</option>
                <option value="อาจารย์ดร.เดือนเพ็ญ ภานุรักษ์">อาจารย์ดร.เดือนเพ็ญ ภานุรักษ์</option>
                <option value="อาจารย์ดร.วีระพน ภานุรักษ์">อาจารย์ดร.วีระพน ภานุรักษ์</option>
                <option value="อาจารย์วินัย โกหลำ">อาจารย์วินัย โกหลำ</option>
                <option value="อาจารย์สมร เหล็กกล้า">อาจารย์สมร เหล็กกล้า</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="school_year">ปีที่จัดทำ</label>
              <select
                name="school_year"
                value={searchCriteria.school_year}
                onChange={handleSearchChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              >
                <option value="">เลือกปีที่จัดทำ</option>
                <option value="2566">2566</option>
                <option value="2567">2567</option>
              </select>
            </div>


            
          </div>

          
        </div>

        <table className="min-w-full mt-6 bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">เลือก</th>
              <th className="py-2 px-4 border-b">ลำดับ</th>
              <th className="py-2 px-4 border-b">หัวข้อโครงงาน</th>
              <th className="py-2 px-4 border-b">ผู้แต่ง</th>
              <th className="py-2 px-4 border-b">รหัสนักศึกษา</th>
              <th className="py-2 px-4 border-b">ที่ปรึกษาโครงงาน</th>
              <th className="py-2 px-4 border-b">ประธาน</th>
              <th className="py-2 px-4 border-b">ผู้ทรงคุณวุฒิ</th>
              <th className="py-2 px-4 border-b">ปีที่จัดทำ</th>
              <th className="py-2 px-4 border-b">ประเภทการพัฒนา</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <tr key={project.id_project}>
                  <td className="px-6 py-4 border-b">
                    <input
                      type="checkbox"
                      checked={selectedProjects.includes(project.id_project)}
                      onChange={() => handleCheckboxChange(project.id_project)}
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                  </td>
                  <td className="py-2 px-4 border-b">{index + 1}</td>
                  <td className="px-6 py-4 border-b text-blue-600"><Link to={`/project/${project.id_project}`}>{project.project_title}</Link></td>
                  <td className="px-6 py-4 border-b" dangerouslySetInnerHTML={{ __html: project.creators }}></td>
                  <td className="px-6 py-4 border-b" dangerouslySetInnerHTML={{ __html: project.id_students }}></td>
                  <td className="px-6 py-4 border-b">{project.advisor}</td>
                  <td className="px-6 py-4 border-b">{project.chairman}</td>
                  <td className="px-6 py-4 border-b">{project.expert}</td>
                  <td className="px-6 py-4 border-b">{project.school_year}</td>
                  <td className="px-6 py-4 border-b">{project.development_type}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">ไม่มีข้อมูลที่ตรงตามเงื่อนไข</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mt-6 flex justify-end">
          <Link to="/new-project">
          <button className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600 mr-2">
            เพิ่มโครงงาน
          </button>

          </Link>
          <button
            onClick={handleDeleteSelected}
            className="bg-red-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-red-600 mr-2"
          >
            ลบที่เลือก
          </button>
          <button
            onClick={handleEditClick}
            className="bg-yellow-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-yellow-600"
          >
            แก้ไขที่เลือก
          </button>
        </div>
      </main>
    </div>
  );
}

export default ManageProject;