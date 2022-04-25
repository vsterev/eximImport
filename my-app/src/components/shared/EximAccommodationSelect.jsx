import React, { useContext, useEffect, useState } from 'react';
import PartnerContext from '../../utils/partnerContext'
export const EximAccommodationSelect = ({ bookOnlyTransfer, setBookOnlyTransfer, actionSelect, setActionSelect }) => {
    const { partner } = useContext(PartnerContext);
    const changeHandler = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        console.log({ name, value })
        if (name === 'accommodation') {
            console.log('Accommodation ' + e.target.value)
            setBookOnlyTransfer(e.target.value)
        }
        if (name === 'action') {
            console.log('Action ' + e.target.value)
            setActionSelect(e.target.value)
        }
    }
    return (
        <>
            {partner?.code === 'eximpl' &&
                <div>{partner.name}
                    <label htmlFor='action'>action type</label>
                    <select name="action" onChange={changeHandler} value={actionSelect}>
                        <option value="new" >insert new</option>
                        <option value="cancel">cancel existing</option>
                    </select>
                    {actionSelect}
                    {actionSelect !== 'cancel' &&
                        <>
                            <label htmlFor='accommodation'>accomodation type</label>
                            <select name="accommodation" onChange={changeHandler} value={bookOnlyTransfer}>
                                <option value="no" >with accommodation</option>
                                <option value="yes">only transfer</option>
                            </select>
                            {bookOnlyTransfer}
                        </>
                    }
                </div>
            }
        </>
    )
}