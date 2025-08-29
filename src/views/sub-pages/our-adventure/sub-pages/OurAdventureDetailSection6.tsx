// React Imports

// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const OurAdventureDetailSection1 = () => {
  
  return (
    <section className={classnames(styles.adven_detl_sec6)}>
        <div className="container">
            <div className={classnames(styles.included_box)}>
                <h4>Included</h4>
                <ul>
                    <li>✓ 8 nights&apos; accommodation</li>
                    <li>✓ 8 breakfasts, 7 lunches, 7 dinners</li>
                    <li>✓ Our own highly experienced trip leader, with you from start to finish</li>
                    <li>✓ Industry leading Guest-to-Guide ratio (averaging 6:1)</li>
                    <li>✓ Your own &apos;Account&apos;, an online space with everything required for your adventure</li>
                    <li>✓ Our knowledgeable Customer Service Team to answer your queries - just a phone call, email or chat away</li>
                    <li>✓ Customer Service pre-trip phone calls to ensure you&apos;re &apos;trip ready&apos;</li>
                    <li>✓ Delicious snacks to keep you fueled</li>
                    <li>✓ All activities outlined in the itinerary</li>
                    <li>✓ All necessary equipment (well-maintained and safe) for activities</li>
                    <li>✓ Transportation in our air-conditioned vans - safe, clean, modern and comfortable!</li>
                </ul>
            </div>
        </div>
    </section>
  )
}

export default OurAdventureDetailSection1
