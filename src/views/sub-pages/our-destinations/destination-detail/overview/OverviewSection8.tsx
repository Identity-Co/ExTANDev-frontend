// React Imports
import React, { useState } from 'react';

// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const OverviewSection8 = ({ data }: { data?: []; }) => {

  const [openIndex, setOpenIndex] = useState(0);

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  return (
    <section className={classnames(styles.faq_section, 'pt_150')}>
        <div className="container">
            <div className="head_text_center">
                <h2 className="fs_55">Faq’s</h2>
            </div>
            <div className={classnames(styles.faq)}>
            {data.map((data: string, index: number) => (
                <div key={index} className={classnames(styles.faq_box)}>
                    <div key={`${index}-${data.question}`} className={classnames(styles.question, { [styles.open]: openIndex  === index, })} onClick={() => toggleAnswer(index)}>
                        <h4>{data.question}</h4>
                    </div>
                    <div className={classnames(styles.answercont, {[styles.show]: openIndex === index, })}>
                        <div className={classnames(styles.answer)}>
                            <p>{data.answer}</p>
                        </div>
                    </div>
                </div>
            ))}
            </div>
        </div>
    </section>
  )
}

export default OverviewSection8