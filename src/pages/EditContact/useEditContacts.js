import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState} from 'react';

import ContactsService from '../../services/ContactsService';
import toast from '../../utils/toast';
import useSafeAsyncAction from '../../hooks/useSafeAsyncAction';

export default function useEditContact(){
  const [isLoading, setIsLoading] = useState(true);
  const [contactName, setContactName] = useState(null);
  const contactFormRef = useRef(null);

  const {id} = useParams();
  const navigate = useNavigate();
  const safeAsyncAction = useSafeAsyncAction();

  useEffect(() => {
    const controller = new AbortController()
    async function loadContact() {
      try{
        const contact = await ContactsService.getContactById(id, controller.signal);

        safeAsyncAction(() => {
          contactFormRef.current.setFieldsValue(contact);
          setIsLoading(false);
          setContactName(contact.name)
        })
      }
      catch(error){
        if(error instanceof DOMException && error.name === 'AbortError'){
          return;
        }

        safeAsyncAction(() => {
          navigate('/', { replace: true });

          toast({
            type: 'danger',
            text: 'Contato não encontrado!'
          })
        })
       }
    }

    loadContact();

    return () => {
      controller.abort()
    }
  }, [id, safeAsyncAction, navigate]);

  async function handleSubmit(contact){
    try{
      const updatedContactData = await ContactsService.updateContact(id, contact);

      setContactName(updatedContactData.name);

      toast({
        type: 'success',
        text: 'Contato editado com sucesso!',
      })
    }catch{
      toast({
        type: 'danger',
        text: 'Ocorreu um erro ao editar o contato!'
      })
    }
  }

  return {
    isLoading,
    contactName,
    contactFormRef,
    handleSubmit
  }

}
