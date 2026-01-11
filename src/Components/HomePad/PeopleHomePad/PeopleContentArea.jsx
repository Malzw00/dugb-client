import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStudents, getSupervisors } from "@root/src/services/people";
import PersonCard from "@root/src/components/PreMadeComponents/PersonCard";
import { setPerson } from "@root/src/store/slices/person.slice";
import Loading from "../../PreMadeComponents/Loading";

// ثوابت للأنواع
const PEOPLE_TYPES = {
  STUDENTS: 'students',
  SUPERVISORS: 'supervisors'
};

// أنواع البيانات
const PERSON_ID_MAPPING = {
  [PEOPLE_TYPES.STUDENTS]: 'student_id',
  [PEOPLE_TYPES.SUPERVISORS]: 'supervisor_id'
};

const PERSON_NAME_FIELDS = {
  [PEOPLE_TYPES.STUDENTS]: ['student_name', 'student_father_name', 'student_grandfather_name', 'student_family_name'],
  [PEOPLE_TYPES.SUPERVISORS]: ['supervisor_name', 'supervisor_father_name', 'supervisor_grandfather_name', 'supervisor_family_name']
};

// وظيفة مساعدة لاسترجاع البيانات
const fetchPeopleData = {
  [PEOPLE_TYPES.STUDENTS]: getStudents,
  [PEOPLE_TYPES.SUPERVISORS]: getSupervisors
};

export default function PeopleContentArea() {
  const dispatch = useDispatch();
  const [people, setPeople] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const selectedPeopleTab = useSelector(state => state.selectedPeopleTab.value);

  // دالة ديناميكية لاسترجاع البيانات
  const fetchPeople = useCallback(async () => {
    if (!selectedPeopleTab) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const fetchFunction = fetchPeopleData[selectedPeopleTab];
      if (!fetchFunction) {
        throw new Error(`No fetch function for type: ${selectedPeopleTab}`);
      }
      
      const response = await fetchFunction();
      setPeople(response?.data?.result || []);
    } catch (err) {
      console.error('Error fetching people:', err);
      setError(err.message || 'Failed to fetch data');
      setPeople([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedPeopleTab]);

  useEffect(() => {
    fetchPeople();
  }, [fetchPeople]);

  // الحصول على معرف الشخص ديناميكياً
  const getPersonId = useCallback((person) => {
    const idField = PERSON_ID_MAPPING[selectedPeopleTab];
    return person?.[idField] || '';
  }, [selectedPeopleTab]);

  // بناء اسم الشخص ديناميكياً
  const getPersonName = useCallback((person) => {
    if (!selectedPeopleTab || !person) return '';
    
    const nameFields = PERSON_NAME_FIELDS[selectedPeopleTab];
    return nameFields
      .map(field => person[field] || '')
      .filter(name => name.trim())
      .join(' ')
      .trim();
  }, [selectedPeopleTab]);

  // معالج النقر على بطاقة الشخص
  const handlePersonClick = useCallback((person) => {
    if (!selectedPeopleTab || !person) return;
    
    const personId = getPersonId(person);
    if (personId) {
      dispatch(setPerson(personId));
    }
  }, [selectedPeopleTab, getPersonId, dispatch]);

  // عرض حالة التحميل
  const renderLoading = () => (
    <div className="loading-state">
      <Loading />
    </div>
  );

  // عرض حالة الخطأ
  const renderError = () => (
    <div className="error-state">
      <p>Error: {error}</p>
      <button 
        onClick={fetchPeople}
        className="retry-button"
      >
        Retry
      </button>
    </div>
  );

  // عرض حالة عدم وجود بيانات
  const renderEmptyState = () => (
    <div className="empty-state">
      <p>No people found</p>
    </div>
  );

  // عرض قائمة الأشخاص
  const renderPeopleList = useMemo(() => {
    if (!people.length) return renderEmptyState();
    
    return (
      <div className="people-list">
        {people.map((person, index) => (
          <PersonCard
            key={person[getPersonId(person)] || index}
            type={selectedPeopleTab}
            onClick={() => handlePersonClick(person)}
            id={getPersonId(person)}
            name={getPersonName(person)}
            updated_at={person.updatedAt}
            email={person.email || person.student_email || person.supervisor_email}
            phone={person.phone || person.student_phone || person.supervisor_phone}
          />
        ))}
      </div>
    );
  }, [people, selectedPeopleTab, getPersonId, getPersonName, handlePersonClick]);

  return (
    <div className="content-area">
      <div 
        className="people-area" 
        style={{
          background: 'transparent', 
          border: 'none', 
          boxShadow: 'none'
        }}
      >
        {isLoading && renderLoading()}
        {error && renderError()}
        {!isLoading && !error && renderPeopleList}
      </div>
    </div>
  );
}