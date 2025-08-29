// React Imports
import React, { useState } from 'react';

// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const OverviewSection8 = () => {

  const [openIndex, setOpenIndex] = useState(0);

  const toggleAnswer = (index) => {
    // Toggle the clicked item and close others
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: 'How do I get to the DR?',
      answer: 'The Dominican Republic is a stunning Caribbean paradise where breathtaking natural beauty meets heart-pounding adventure. From its pristine white-sand beaches and lush mountain landscapes to its vibrant culture and warm hospitality, the island offers something for every traveler.',
    },
    {
      question: 'Which documents do I need?',
      answer: 'The Dominican Republic is a stunning Caribbean paradise where breathtaking natural beauty meets heart-pounding adventure. From its pristine white-sand beaches and lush mountain landscapes to its vibrant culture and warm hospitality, the island offers something for every traveler.',
    },
    {
      question: 'What is the best time of year to visit?',
      answer: 'The Dominican Republic is a stunning Caribbean paradise where breathtaking natural beauty meets heart-pounding adventure. From its pristine white-sand beaches and lush mountain landscapes to its vibrant culture and warm hospitality, the island offers something for every traveler.',
    },
    {
      question: 'What is the legal drinking age?',
      answer: 'The Dominican Republic is a stunning Caribbean paradise where breathtaking natural beauty meets heart-pounding adventure. From its pristine white-sand beaches and lush mountain landscapes to its vibrant culture and warm hospitality, the island offers something for every traveler.',
    },
    {
      question: 'I don’t speak Spanish, is this a problem?',
      answer: 'The Dominican Republic is a stunning Caribbean paradise where breathtaking natural beauty meets heart-pounding adventure. From its pristine white-sand beaches and lush mountain landscapes to its vibrant culture and warm hospitality, the island offers something for every traveler.',
    },
    {
      question: 'Can I spend US dollars or Euros?',
      answer: 'The Dominican Republic is a stunning Caribbean paradise where breathtaking natural beauty meets heart-pounding adventure. From its pristine white-sand beaches and lush mountain landscapes to its vibrant culture and warm hospitality, the island offers something for every traveler.',
    },
  ];
  
  return (
    <section className={classnames(styles.faq_section, 'pt_150')}>
        <div className="container">
            <div className="head_text_center">
                <h2 className="fs_55">Faq’s</h2>
            </div>
            <div className={classnames(styles.faq)}>
            {faqs.map((faq, index) => (
                <div key={index} className={classnames(styles.faq_box)}>
                    <div key={`${index}-${faq.question}`} className={classnames(styles.question, { [styles.open]: openIndex  === index, })} onClick={() => toggleAnswer(index)}>
                        <h4>{faq.question}</h4>
                    </div>
                    <div className={classnames(styles.answercont, {[styles.show]: openIndex === index, })}>
                        <div className={classnames(styles.answer)}>
                            <p>{faq.answer}</p>
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