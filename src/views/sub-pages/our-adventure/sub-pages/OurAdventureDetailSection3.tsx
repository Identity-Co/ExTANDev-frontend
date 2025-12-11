// React Imports

// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const OurAdventureDetailSection3 = ({ tour_details, categories }: { tour_details: any; categories: any; }) => {
    
    // Build quick lookup by api_category_id
    const categoriesById = Object.fromEntries(
      categories.map(cat => [cat.api_category_id, cat])
    );

    // Only loop through categories from tour_details.categories array
    const mappedCategories = tour_details?.categories?.map(catId => {
      const currentCat = categoriesById[catId];
      if (!currentCat) return null;

      const parentCat = categoriesById[currentCat.api_parent_id];

      return {
        id: currentCat.api_category_id,
        parent: parentCat ? parentCat.category_name : null,
        current: currentCat.category_name,
        description: currentCat.description || ''
      }
    }).filter(Boolean);

    return (
        <section className={classnames(styles.tour_for_me, 'pt_150')}>
            <div className="container">
                <div className={classnames(styles.tour_bg)}>
                    <div className={classnames(styles.tour_inner)}>
                        <h3>Is this tour for me?</h3>
                        <div className={classnames(styles.tour_main_row)}>
                            <div className={classnames(styles.tour_clmn_left)}>
                                <div className={classnames(styles.tour_info_row)}>
                                    {mappedCategories?.map(cat => (
                                      <div key={cat.id} className={classnames(styles.tour_info_box)}>
                                        <h4>
                                          {cat.parent ? `${cat.parent}: ` : ''}
                                          <span>{cat.current}</span>
                                        </h4>
                                        <p>{cat.description}</p>
                                      </div>
                                    ))}
                                </div>
                            </div>
                            <div className={classnames(styles.tour_clmn_right)}>
                                <div className={classnames(styles.check_visa)}>
                                    <h4>Check Your Visa Requirements</h4>
                                    <p>Before booking, use our handy entry requirements tool so you know which documents you need to enter and travel through the countries on your trip.</p>
                                    <div className={classnames(styles.btn, 'btn')}>
                                        <a href="https://www.gadventures.com/travel-and-visa-requirements/">View our Entry Requirements tool</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default OurAdventureDetailSection3
