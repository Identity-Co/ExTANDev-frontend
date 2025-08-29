// React Imports

// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const OverviewSection3 = () => {
  
  return (
    <section className={classnames(styles.destination_overview_sec5, 'pt_50', 'pb_150')}>
        <div className="container">
            <div className={classnames(styles.dr_quick)}>
                <h2>Dominican Republic</h2>
                <h4 className="fs_55">Dr quick facts</h4>
            </div>
            <div className={classnames(styles.grid2, 'grid2')}>
                <div className={classnames(styles.grid_box)}>
                    <ul>
                        <li><span className="extra_bold"><em>Location:</em></span> Caribbean island of Hispaniola, shared with Haiti</li>
                        <li><span className="extra_bold"><em>Capital:</em></span> Santo Domingo<br />(the oldest European-founded city in the Americas)</li>
                        <li><span className="extra_bold"><em>Language:</em></span> Spanish</li>
                        <li><span className="extra_bold"><em>Currency:</em></span> Dominican Peso (DOP)</li>
                        <li><span className="extra_bold"><em>Climate:</em></span> Tropical—warm and sunny year-round</li>
                        <li><span className="extra_bold"><em>Time Zone:</em></span> Atlantic Standard Time (AST)</li>
                        <li><span className="extra_bold"><em>Highest Peak in the Caribbean:</em></span> Pico Duarte (10,164 ft)</li>
                    </ul>
                </div>
                <div className={classnames(styles.grid_box)}>
                    <ul>
                        <li><span className="extra_bold"><em>Longest River:</em></span> Yaque del Norte—great for rafting and river adventures</li>
                        <li><span className="extra_bold"><em>Miles of Coastline:</em></span> Over 900 miles, with countless beaches to explore</li>
                        <li><span className="extra_bold"><em>National Parks:</em></span> 29 protected areas offering jungles, mountains, and marine life</li>
                        <li><span className="extra_bold"><em>Waterfalls:</em></span> Over 100, including the famous Salto El Limón and Salto de Baiguate</li>
                        <li><span className="extra_bold"><em>Outdoor Activities:</em></span> Hiking, canyoning, zip-lining, kiteboarding, whale watching</li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
  )
}

export default OverviewSection3