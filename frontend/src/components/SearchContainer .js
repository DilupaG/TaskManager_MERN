import { FormRow, FormRowSelect } from '.'
import { useAppContext } from '../context/appContext'
import Wrapper from '../assets/wrappers/SearchContainer'


const SearchContainer  = () => {

  const {
    isLoading,
    search,
    searchStatus,
    sort,
    sortOptions,
    handleChange,
    statusOptions,
  } = useAppContext()

  const handleSearch = (e) => {
    if (isLoading) return
    handleChange({ name: e.target.name, value: e.target.value })
  }

  return (
    <Wrapper>
      <form className='form'>
        <h4>search form</h4>
        <div className='form-center'>
          {/* search position */}

          <FormRow
            type='text'
            name='search'
            value={search}
            handleChange={handleSearch}
          />
          {/* search by status */}
          <FormRowSelect
            labelText='status'
            name='searchStatus'
            value={searchStatus}
            handleChange={handleSearch}
            list={['all', ...statusOptions]}
          />
          
          {/* sort */}
          <FormRowSelect
            name='sort'
            value={sort}
            handleChange={handleSearch}
            list={sortOptions}
          />
        </div>
      </form>
    </Wrapper>
  )
}

export default SearchContainer 