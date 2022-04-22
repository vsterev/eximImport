import React, {useContext, useEffect, useState} from 'react';
import PartnerContext from '../../utils/partnerContext'
export const EximAccommodationSelect = ({bookOnlyTransfer, setBookOnlyTransfer}) =>{
const {partner} = useContext(PartnerContext);
const changeHandler = (e) =>{
    e.preventDefault();
    setBookOnlyTransfer(e.target.value)
}
return(
<>
{partner?.code==='eximpl'&&<div>{partner.name}
<label htmlFor='accommodation-select'>accomodation type</label>
<select name="accomomdation-select" onChange={changeHandler} value={bookOnlyTransfer}>
    <option value="no" >with accommodation</option>
    <option value="yes">only transfer</option>
</select>
{!!bookOnlyTransfer&&bookOnlyTransfer}
</div>}
</>
)
}