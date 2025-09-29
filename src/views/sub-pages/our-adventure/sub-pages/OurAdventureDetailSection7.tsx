// React Imports
import { useState} from 'react'

import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'

// Third-party Imports
import classnames from 'classnames'


// Styles Imports
import styles from './styles.module.css'

const OurAdventureDetailSection7 = ({ tour_details }: { tour_details: any; }) => {

    const [expanded, setExpanded] = useState('1');
    const [showAll, setShowAll] = useState(false);

    const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
    }

    const handleShowMore = () => {
        setShowAll(!showAll);
    };

    /*const faqData = [
        { 
            id: '1',
            question: 'Where does the trip start?',
            answer: 'On the first day of the trip we’ll meet you at Hotel Parque del Lago at 6pm for dinner with your fellow adventurers. You are welcome to book your pre-trip stay at this hotel directly or any other hotel in San Jose, though you must make your own way to Hotel Parque del Lago at the pre-designated time.'
        },
        { 
            id: '2',
            question: 'Where does the trip end?',
            answer: 'On the first day of the trip we’ll meet you at Hotel Parque del Lago at 6pm for dinner with your fellow adventurers. You are welcome to book your pre-trip stay at this hotel directly or any other hotel in San Jose, though you must make your own way to Hotel Parque del Lago at the pre-designated time.'
        },
        { 
            id: '3',
            question: 'What flights would you recommend?',
            answer: 'On the first day of the trip we’ll meet you at Hotel Parque del Lago at 6pm for dinner with your fellow adventurers. You are welcome to book your pre-trip stay at this hotel directly or any other hotel in San Jose, though you must make your own way to Hotel Parque del Lago at the pre-designated time.'
        },
        { 
            id: '4',
            question: 'What are the accommodations we stay at on this trip?',
            answer: 'On the first day of the trip we’ll meet you at Hotel Parque del Lago at 6pm for dinner with your fellow adventurers. You are welcome to book your pre-trip stay at this hotel directly or any other hotel in San Jose, though you must make your own way to Hotel Parque del Lago at the pre-designated time.'
        },
        { 
            id: '5',
            question: 'How fit do I need to be for this trip?',
            answer: 'On the first day of the trip we’ll meet you at Hotel Parque del Lago at 6pm for dinner with your fellow adventurers. You are welcome to book your pre-trip stay at this hotel directly or any other hotel in San Jose, though you must make your own way to Hotel Parque del Lago at the pre-designated time.'
        },
        { 
            id: '6',
            question: 'How fit do I need to be for this trip?',
            answer: 'On the first day of the trip we’ll meet you at Hotel Parque del Lago at 6pm for dinner with your fellow adventurers. You are welcome to book your pre-trip stay at this hotel directly or any other hotel in San Jose, though you must make your own way to Hotel Parque del Lago at the pre-designated time.'
        },
        { 
            id: '7',
            question: 'How fit do I need to be for this trip?',
            answer: 'On the first day of the trip we’ll meet you at Hotel Parque del Lago at 6pm for dinner with your fellow adventurers. You are welcome to book your pre-trip stay at this hotel directly or any other hotel in San Jose, though you must make your own way to Hotel Parque del Lago at the pre-designated time.'
        },
    ];*/

    const faqData = tour_details.full_details.map((item, index) => ({
        id: (index + 1).toString(),
        question: item.label,
        answer: item.content
    }));
  
    return (
        <section className={classnames(styles.faq_section, styles.adven_detl_sec5, 'pb_150')}>
            <div className="container">
                <div className={classnames(styles.head_text_center, 'head_text_center')}>
                    <h2 className="fs_55">USEFUL INFO</h2>
                </div>
                <div className={classnames(styles.faq)}>
                    {faqData.slice(0, 5).map(faq => (
                        <div key={faq.id} className={classnames(styles.faq_box)}>
                            <Accordion expanded={expanded === faq.id ? true : false} onChange={handleChange(faq.id)}>
                                <AccordionSummary 
                                    id={`panel-header-${faq.id}`}
                                    aria-controls={`panel-content-${faq.id}`}
                                    sx={{ padding: 0, '& .MuiAccordionSummary-expandIconWrapper': { display: 'none' } }}
                                    >
                                    <div className={classnames(styles.question, expanded === faq.id ? styles.open : '')}>
                                        <h4>{faq.question}</h4>
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <div className={classnames(styles.answercont)}>
                                        <div className={classnames(styles.answer)}>
                                        <p dangerouslySetInnerHTML={{ __html: faq.answer.replace(/\n/g, '<br />') }} />
                                        </div>
                                    </div>
                                </AccordionDetails>
                            </Accordion>
                        </div>
                    ))}

                    {showAll && faqData.slice(5).map(faq => (
                        <div key={faq.id} className={classnames(styles.faq_box)}>
                            <Accordion expanded={expanded === faq.id ? true : false} onChange={handleChange(faq.id)}>
                                <AccordionSummary 
                                    id={`panel-header-${faq.id}`}
                                    aria-controls={`panel-content-${faq.id}`}
                                    sx={{ padding: 0, '& .MuiAccordionSummary-expandIconWrapper': { display: 'none' } }}
                                    >
                                    <div className={classnames(styles.question, expanded === faq.id ? styles.open : '')}>
                                        <h4>{faq.question}</h4>
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <div className={classnames(styles.answercont)}>
                                        <div className={classnames(styles.answer)}>
                                            <p dangerouslySetInnerHTML={{ __html: faq.answer.replace(/\n/g, '<br />') }} />
                                        </div>
                                    </div>
                                </AccordionDetails>
                            </Accordion>
                        </div>
                    ))}
                </div>
                <div className={classnames(styles.faq_more_btn)}>
                    <button onClick={handleShowMore}>{showAll ? "- SHOW LESS" : "+ SHOW MORE"}</button>
                </div>
            </div>
        </section>
    )
}

export default OurAdventureDetailSection7
