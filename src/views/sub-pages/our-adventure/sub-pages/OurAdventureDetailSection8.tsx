// React Imports

// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const OurAdventureDetailSection8 = ({ tour, tour_details }: { tour: any; tour_details: any; }) => {

    const whatsIncluded = tour_details?.full_details?.find(
      item => item.intro_id === 30  //  item => item.label === "What's Included"
    );

    const lines = whatsIncluded?.content
      .split(/\n|\. /)
      .filter(Boolean);


    const accommodation = tour_details?.full_details?.find(
      item => item.intro_id === 6  //  item => item.label === "Accommodation"
    );

    const mealsInc = tour_details?.full_details?.find(
      item => item.intro_id === 10  //  item => item.label === "Meals Included"
    );

    const transport = tour_details?.full_details?.find(
      item => item.intro_id === 7  //  item => item.label === "Transport"
    );

    const groupLeader = tour_details?.full_details?.find(
      item => item.intro_id === 18  //  item => item.label === "Group Leader"
    );
  
  return (
    <section className={classnames(styles.adven_detl_sec6)}>
        <div className="container">
            <div className={classnames(styles.included_box)}>
                {lines && (
                    <>
                        <h4>Included</h4>
                        <ul>
                            {lines?.map((line, idx) => {
                                const [beforeColon, ...afterColon] = line.split(':');
                                return (
                                  <li key={idx}>
                                    ✓{' '}
                                    {afterColon.length > 0 ? (
                                      <>
                                        <strong>{beforeColon}:</strong> {afterColon.join(':')}
                                      </>
                                    ) : (
                                      line
                                    )}
                                  </li>
                                );
                            })}
                        </ul>
                    </>
                )}

                {accommodation && (
                    <>
                        <h4>Accommodations</h4>
                        <ul>
                            <li>✓ {accommodation?.content}</li>
                        </ul>
                    </>
                )}

                {mealsInc && (
                    <>
                        <h4>Meals</h4>
                        <ul>
                            <li>✓ {mealsInc?.content}</li>
                        </ul>
                    </>
                )}

                {transport && (
                    <>
                        <h4>Transportation</h4>
                        <ul>
                            <li>✓ {transport?.content}</li>
                        </ul>
                    </>
                )}

                {groupLeader && (
                    <>
                        <h4>Staff & experts</h4>
                        <ul>
                            <li>✓ {groupLeader?.content}</li>
                        </ul>
                    </>
                )}
            </div>
        </div>
    </section>
  )
}

export default OurAdventureDetailSection8
