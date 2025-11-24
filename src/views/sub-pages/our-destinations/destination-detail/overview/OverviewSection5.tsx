// React Imports

// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const OverviewSection5 = ({ data, destinationName }: { data?: []; destinationName?: ''; }) => {
    const imageUrl = `${process.env.NEXT_PUBLIC_UPLOAD_URL}/\\${data.quick_facts_background}`;
  
  return (
    <section 
        className={classnames(styles.destination_overview_sec5, 'pt_50', 'pb_150')}
        style={{
            backgroundImage: `url("${imageUrl}")`,
        }}
    >
        <div className="container">
            <div className={classnames(styles.dr_quick)}>
                <h2>{destinationName}</h2>
                <h4 className="fs_55">{data?.quick_facts_title} facts</h4>
            </div>
            <div className={classnames(styles.dr_list)}>
                <div className={classnames(styles.grid_box)}>
                    <ul>
                        {data?.facts?.map((section: any, index: number) => {
                            return <li key={index}><span className="extra_bold"><em>{section?.label}:</em></span> {section?.content}</li>
                        })}
                    </ul>
                </div>
                {/*<div className={classnames(styles.grid_box)}>
                    <ul>
                        <li><span className="extra_bold"><em>Longest River:</em></span> Yaque del Norte—great for rafting and river adventures</li>
                        <li><span className="extra_bold"><em>Miles of Coastline:</em></span> Over 900 miles, with countless beaches to explore</li>
                        <li><span className="extra_bold"><em>National Parks:</em></span> 29 protected areas offering jungles, mountains, and marine life</li>
                        <li><span className="extra_bold"><em>Waterfalls:</em></span> Over 100, including the famous Salto El Limón and Salto de Baiguate</li>
                        <li><span className="extra_bold"><em>Outdoor Activities:</em></span> Hiking, canyoning, zip-lining, kiteboarding, whale watching</li>
                    </ul>
                </div>*/}
            </div>
        </div>
    </section>
  )
}

export default OverviewSection5