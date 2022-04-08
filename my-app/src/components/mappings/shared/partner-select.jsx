import React from 'react';

const PartnerSelect = ({ setSelected, setInitialArr, setSearchedArr, setSearched, selected, type }) => {
  const selectHandler = (e) => {
    setSelected(e.target.value);
    setInitialArr([]);
    setSearchedArr([]);
    if (type !== 'Hotels') {
      setSearched('');
    } else {
      setSearched({ hotel: '', city: '' });
    }
    // type !== 'Hotels' ? setSearched('') : setSearched({ hotel: '', city: '' });
    // setSearched('');
  };
  return (
    <div>
      <h2>
        {type} Mapping {selected ? `for partner - ${selected}` : ' - select a patner'}
      </h2>
      <label htmlFor="partnerSelect">Select a partner: </label>
      <select id="partnerSelect" onChange={selectHandler} defaultValue={selected}>
        <option value="">please select</option>
        <option value="exim">Exim tours</option>
        <option value="partner2">Partner 2</option>
      </select>
    </div>
  );
};
export default PartnerSelect;
