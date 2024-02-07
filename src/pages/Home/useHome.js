import toast from '../../utils/toast';

import { useEffect, useState, useDeferredValue, useCallback, useMemo } from 'react';

import ContactsService from '../../services/ContactsService';


export default function useHome(){
  const [contacts, setContacts] = useState([]);
  const [orderBy, setOrderBy] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [contactBeingDeleted , setContactBeingDeleted] = useState(null);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const deferredSearchTerm = useDeferredValue(searchTerm);

  const filteredContacts = useMemo(() => contacts.filter((contact) => (
    contact.name.toLowerCase().includes(deferredSearchTerm.toLowerCase()))
  ), [contacts, deferredSearchTerm]);

  const loadContacts = useCallback(async (signal) => {
    try {
      setIsLoading(true);

      const contactsList = await ContactsService.listContacts(orderBy, signal);
      setHasError(false);
      setContacts(contactsList);
    }catch(error) {
      if(error instanceof DOMException && error.name === 'AbortError'){
        return;
      };
      setHasError(true);
      setContacts([]);
    }finally {
      setIsLoading(false);
    };
  }, [orderBy]);

  useEffect(() => {
    const controller = new AbortController();
    loadContacts(controller.signal);

    return () => {
      controller.abort();
    }
  }, [loadContacts]);


  const handleToggleOrderBy = useCallback(() => {
    setOrderBy(
      (prevState) => prevState === 'asc' ? 'desc' : 'asc',
    );
  }, [])

  function handleChangeSearchTerm(event){
    setSearchTerm(event.target.value);
  }

  function handleTryAgain(){
    loadContacts();
  }

  const handleDeleteContact = useCallback((contact) => {
    setContactBeingDeleted(contact)
    setIsDeleteModalVisible(true);
  }, [])

  function handleCloseDeleteModal(){
    setIsDeleteModalVisible(false);
  }

  async function handleConfirmDeleteContact(){
    try{
      setIsLoadingDelete(true);

      await ContactsService.deleteContact(contactBeingDeleted.id);

      setContacts((prevState) => prevState.filter(
        (contact) => contact.id !== contactBeingDeleted.id
      ))

      handleCloseDeleteModal();

      toast({
        type: 'success',
        text: 'Contato deletado com sucesso!'
      })

    }catch{
      toast({
        type: 'danger',
        text: 'Ocorreu um erro ao deletar o contato!'
      })
    }finally{
      setIsLoadingDelete(false);
    }
  }

  return {
      isLoading,
      contactBeingDeleted,
      isDeleteModalVisible,
      handleCloseDeleteModal,
      handleConfirmDeleteContact,
      isLoadingDelete,
      contacts,
      searchTerm,
      handleChangeSearchTerm,
      hasError,
      filteredContacts,
      handleTryAgain,
      orderBy,
      handleToggleOrderBy,
      handleDeleteContact,
    }

}
