// React Imports
import React, { useState, useMemo } from 'react'

// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const OurAdventureDetailSection5 = ({ tour, tour_details }: { tour: any; tour_details: any; }) => {
    
    const statuses = {"AVAILABLE": "Open", "WAIT_LIST": "Sold Out", "REQUEST_SPACE": "Request"};

    const formatDate = (dateStr) => {
        const date = new Date(dateStr)
        const weekday = date.toLocaleDateString('en-US', { weekday: 'short' })
        const month   = date.toLocaleDateString('en-US', { month: 'short' })
        const day     = date.toLocaleDateString('en-US', { day: '2-digit' })
        const year    = date.getFullYear()

        return `${weekday}, ${month} ${day} ${year}`
    }

    const formatAmount = (amount) => {
        return amount.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        });
    }

    const [selectedYear, setSelectedYear] = useState<number | ''>('');

    const availableYears = useMemo(() => {
        const years = tour_details.availabilities.map(slot => new Date(slot.start_date).getFullYear());
        return Array.from(new Set(years)).sort((a, b) => a - b); // unique and sorted
    }, [tour_details.availabilities]);

    /*const filteredSlots = useMemo(() => {
        if (!selectedYear) return tour_details.availabilities;
        return tour_details.availabilities.filter(slot => new Date(slot.start_date).getFullYear() === Number(selectedYear));
    }, [selectedYear, tour_details.availabilities]);*/

    const filteredSlots = useMemo(() => {
        let slots = tour_details.availabilities;

        // filter by selected year if any
        if (selectedYear) {
            slots = slots.filter(slot => new Date(slot.start_date).getFullYear() === Number(selectedYear));
        }

        // sort by start_date ascending
        return slots.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
    }, [selectedYear, tour_details.availabilities]);
    
    return (
        <section className={classnames(styles.adven_detl_sec4, 'pb_150')}>
            <div className="container">
                <div className={classnames(styles.departure_ates, 'bx_sd')}>
                   <div className={classnames(styles.departure_ates_inner)}>
                       <h4>{tour.name} Departure Dates</h4>
                       <div className={classnames(styles.search_row)}>
                           <form>
                                <div className={classnames(styles.search_select, styles.ss1)}>
                                    <label>Select Year</label>
                                    <select 
                                        value={selectedYear} 
                                        onChange={e => setSelectedYear(e.target.value ? Number(e.target.value) : '')}
                                    >
                                        <option value="">All years</option>
                                        {availableYears.map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                            </form>
                        </div>
                        <h4 className={classnames(styles.selsect_year)}>{selectedYear || 'All Years'}</h4>
                        <div className={classnames(styles.departure_table_main)}>
                            <div className={classnames(styles.departure_table)}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Start</th>
                                            <th>Ending</th>
                                            <th>Availability</th>
                                            <th>Prices from</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {filteredSlots.map(slot => (
                                            <tr key={slot.start_date}>
                                                <td>{formatDate(slot.start_date)}</td>
                                                <td>{formatDate(slot.finish_date)}</td>
                                                <td className={classnames({[styles.item_sold]: slot.status === "WAIT_LIST"})}>{statuses[slot.status]} {slot.status !== "WAIT_LIST" && `(${slot.spaces})`}</td>
                                                <td>{formatAmount(slot.price)} USD<br /><span className={classnames(styles.price_tax)}>(price includes taxes and fees)</span></td>
                                                <td>
                                                    {slot.status == 'WAIT_LIST' && (<div className={classnames(styles.btn, styles.sold_btn, 'btn')}><a>SOLD OUT</a></div>)}
                                                    {slot.status == 'REQUEST_SPACE' && (<div className={classnames(styles.btn, styles.departure_btn_set, 'btn')}><a href={`${tour_details.site_links.checkout}#date/${slot.start_date.slice(0,10)}`}>INQUIRE</a></div>)}
                                                    {slot.status == 'AVAILABLE' && (<div className={classnames(styles.btn, styles.departure_btn_set, 'btn')}><a href={`${tour_details.site_links.checkout}#date/${slot.start_date.slice(0,10)}`}>BOOK</a></div>)}
                                                    
                                                </td>
                                            </tr>
                                        ))}
                                        
                                    </tbody>
                                </table>
                            </div>
                        </div>
                   </div> 
                </div>
            </div>
        </section>
    )
}

export default OurAdventureDetailSection5
