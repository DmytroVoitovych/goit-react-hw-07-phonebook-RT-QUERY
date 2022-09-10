import {useState, useMemo} from "react";
import { nanoid } from 'nanoid';
import { Phonebook } from "components/Phonebook/Phonebook";
import { Contacts } from "components/Contacts/Contacts";
import { Filter } from "components/Filter/Filter";
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { useGetContactsQuery, useAddContactsMutation, useDellContactsMutation} from "./redux/rtq";


export const App = () => {
  const { data = [], isSuccess,} = useGetContactsQuery();
  const [addContact] = useAddContactsMutation();
  const [dellContact] = useDellContactsMutation();
    
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [filter, setFilter] = useState('');

  const deleteContact = (id) => { // удаление контакта
    if (isSuccess) {
      Notify.success('The contact has been successfully deleted.');
      return dellContact(id).unwrap()
    }
    return Notify.failure('The contact has Error');
      };
 
  const getValueInput = (e) => { // получение значений инпутов формы
    // https://ru.reactjs.org/docs/forms.html  по примеру с документации
    const target = e.target.type;
    const val = e.target.value;
     switch (target) {
      case 'text':
        setName(val);
        break;
       case 'tel':
         setNumber(val);
         break;
      default:
        return;
    }
   }; 
  
  const chekingContacts = () => {// проверка уникальности имени
     const chek = data.find((contact) =>contact.name === name); //ищем одинаковое 
          if (chek) { // если есть уже
             Report.failure('Error', 'This name is already in your contact list, enter another name, and try again.', 'OK');
                 }
                       
            else { // если нет
               Notify.success('Contact has been successfully added.')
              return addContact({ id: nanoid(), name: name, number: number }).unwrap();
              }
    };
  
  const setContactsName = (e) => { e.preventDefault(); setName(''); setNumber(''); chekingContacts();}; // проверка уникальности имени в контактах 
 
  const  changeFilter = (e) => { setFilter( e.currentTarget.value) }; // значение фильтра
   
  const contactFiltering =  useMemo(() => { // фильтрация контактов // мемо чисто что бы не было перерендера когда изменяется велью
    const normalizeFilter = filter.toLowerCase();
    return data.filter(contact => contact.name.toLowerCase().includes(normalizeFilter)
      || contact.number.toLowerCase().includes(normalizeFilter));
  }, [data, filter]); //добавил еще фильтер и по номеру 

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 40,
        color: '#010101',
        padding: '0 15px'
      }}
    >
      < section >
            {<Phonebook input={getValueInput} val={{ name: name, tel: number }} btn={setContactsName} load={isSuccess} />}
           <div> <h3>Contacts</h3>
            {<Filter changes={changeFilter}  filter={filter}/> }
          {isSuccess?<Contacts contacts={contactFiltering} away={deleteContact} />: <h2>Loading...</h2>}
                </div>
        </section >
    </div>
  );
};
