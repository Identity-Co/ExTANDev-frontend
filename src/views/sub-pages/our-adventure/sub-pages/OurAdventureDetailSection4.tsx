// React Imports

// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const OurAdventureDetailSection4 = () => {
  
    return (
        <section className={classnames(styles.adven_detl_sec4, 'pb_150')}>
            <div className="container">
                <div className={classnames(styles.departure_ates, 'bx_sd')}>
                   <div className={classnames(styles.departure_ates_inner)}>
                       <h4>Ultimate Costa Rica Departure Dates</h4>
                       <div className={classnames(styles.search_row)}>
                           <form>
                                <div className={classnames(styles.search_select, styles.ss1)}>
                                    <label>Select Year</label>
                                    <select name="cars" id="cars">
                                      <option value="">All years</option>
                                      <option value="">All years</option>
                                      <option value="">All years</option>
                                      <option value="">All years</option>
                                    </select>
                                </div>
                            </form>
                        </div>
                        <h4 className={classnames(styles.selsect_year)}>2025</h4>
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
                                    <tr>
                                        <td>Fri, Sept 5 2025</td>
                                        <td>Sat, Sept 13 2025</td>
                                        <td className={classnames(styles.item_sold)}>Sold Out</td>
                                        <td>$5,699 USD<br /><span className={classnames(styles.price_tax)}>(price includes taxes and fees)</span></td>
                                        <td>
                                            <div className={classnames(styles.btn, styles.sold_btn, 'btn')}>
                                                <a href="#">SOLD OUT</a>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Fri, Oct 3 2025</td>
                                        <td>Sat, Oct 11 2025</td>
                                        <td>Open</td>
                                        <td>$5,699 USD<br /><span className={classnames(styles.price_tax)}>(price includes taxes and fees)</span></td>
                                        <td>
                                            <div className={classnames(styles.btn, styles.departure_btn_set, 'btn')}>
                                                <a href="#">INQUIRE</a>
                                                <a href="#">BOOK</a>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Fri, Dec 12 2025</td>
                                        <td>Sat, Dec 20 2025</td>
                                        <td>Open</td>
                                        <td>$5,699 USD<br /><span className={classnames(styles.price_tax)}>(price includes taxes and fees)</span></td>
                                        <td>
                                            <div className={classnames(styles.btn, styles.departure_btn_set, 'btn')}>
                                                <a href="#">INQUIRE</a>
                                                <a href="#">BOOK</a>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                   </div> 
                </div>
            </div>
        </section>
    )
}

export default OurAdventureDetailSection4
