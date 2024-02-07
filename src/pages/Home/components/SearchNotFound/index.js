import magnifierQuestion from '../../../../assets/images/magnifier-question.svg';
import { Container } from './styles';
import PropTypes from 'prop-types';

export default function SearchNotFound({searchTerm}){
  return(
    <Container>
      <img src={magnifierQuestion} alt="MagnifierQuestion"/>
      <span>
        Nenhum resultado foi encontrado para <strong>{searchTerm}</strong>.
      </span>
    </Container>
  )
}

SearchNotFound.propTypes = {
  searchTerm: PropTypes.string.isRequired
}
