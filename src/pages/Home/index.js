import {Container} from './styles';
import Loader from '../../components/Loader';
import useHome from './useHome';
import InputSearch from './components/InputSearch';
import Header from './components/Header';
import ErrorStatus from './components/ErrorStatus';
import EmptyList from './components/EmptyList';
import SearchNotFound from './components/SearchNotFound';
import ContactsList from './components/ContactsList';
import Modal from '../../components/Modal';

export default function Home(){
  const {
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
  } = useHome();

  const hasContacts = contacts.length > 0;
  const isListEmpty = !hasError && (!isLoading && !hasContacts);
  const isSearchEmpty = !hasError && (hasContacts && filteredContacts.length < 1);

  return (
    <Container>
      <Loader isLoading={isLoading}/>

      {hasContacts && (
        <InputSearch
          value={searchTerm}
          onChange={handleChangeSearchTerm}
        />
      )}
      <Header
        hasError={hasError}
        quantityOfContacts={contacts.length}
        quantityOfFilteredContacts={filteredContacts.length}
      />

      {hasError && <ErrorStatus onTryAgain={handleTryAgain} />}

      {(isListEmpty) && <EmptyList />}

      {(isSearchEmpty) && (
        <SearchNotFound searchTerm={searchTerm} />
      )}

      {hasContacts && (
        <>
          <ContactsList
            filteredContacts={filteredContacts}
            orderBy={orderBy}
            onToggleOrderBy={handleToggleOrderBy}
            onDeleteContact={handleDeleteContact}
          />

          <Modal
                danger
                title={`Tem certeza de que deseja remover o contato "${contactBeingDeleted?.name }"?`}
                visible={isDeleteModalVisible}
                confirmLabel={'Deletar'}
                onCancel={handleCloseDeleteModal}
                onConfirm={handleConfirmDeleteContact}
                isLoading={isLoadingDelete}
              >
                <p>Esta ação não poderá ser desfeita!</p>
          </Modal>

        </>
      )}
    </Container>
 );
}

