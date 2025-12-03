// Third-party Imports
import classnames from 'classnames'
import { useState, useRef, useEffect } from 'react'

import { Masonry } from "@mui/lab"

// Styles Imports
import styles from './styles.module.css'

function formatDateRange(fromDate, toDate) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const from = new Date(fromDate);
  const to = new Date(toDate);

  const fromMonth = months[from.getMonth()];
  const toMonth = months[to.getMonth()];

  const fromDay = from.getDate();
  const toDay = to.getDate();

  const fromYear = from.getFullYear();
  const toYear = to.getFullYear();

  // Same month and year
  if (fromMonth === toMonth && fromYear === toYear) {
    return `${fromMonth} ${fromDay} - ${toDay}, ${fromYear}`;
  }

  // Same year but different months
  if (fromYear === toYear) {
    return `${fromMonth} ${fromDay} - ${toMonth} ${toDay}, ${fromYear}`;
  }

  // Different years
  return `${fromMonth} ${fromDay}, ${fromYear} - ${toMonth} ${toDay}, ${toYear}`;
}

// Helper component for truncated text
const TruncatedText = ({ htmlContent, wordLimit = 14 }: { htmlContent: string; wordLimit?: number }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [displayText, setDisplayText] = useState('')
  const [hasMore, setHasMore] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!htmlContent) {
      setDisplayText('')
      setHasMore(false)
      return
    }

    // Create a temporary div to parse HTML
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = htmlContent

    // Get all text nodes
    const textContent = tempDiv.textContent || tempDiv.innerText || ''
    const words = textContent.trim().split(/\s+/)
    
    if (words.length <= wordLimit) {
      // If text is short, show full content
      setDisplayText(htmlContent)
      setHasMore(false)
    } else {
      // Truncate by words
      const truncatedText = words.slice(0, wordLimit).join(' ')
      
      // Try to preserve HTML structure for truncated text
      let truncatedHtml = ''
      let wordCount = 0
      
      const traverseAndTruncate = (node: Node): boolean => {
        if (wordCount >= wordLimit) return false
        
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent || ''
          const nodeWords = text.trim().split(/\s+/)
          let usedWords = ''
          
          for (const word of nodeWords) {
            if (wordCount >= wordLimit) break
            usedWords += (usedWords ? ' ' : '') + word
            wordCount++
          }
          
          truncatedHtml += usedWords
          return wordCount < wordLimit
        }
        
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element
          const tagName = element.tagName.toLowerCase()
          
          // Skip script and style tags
          if (tagName === 'script' || tagName === 'style') return true
          
          // Open tag
          const attrs = Array.from(element.attributes)
            .map(attr => ` ${attr.name}="${attr.value}"`)
            .join('')
          truncatedHtml += `<${tagName}${attrs}>`
          
          // Process children
          for (const child of Array.from(element.childNodes)) {
            if (!traverseAndTruncate(child)) break
          }
          
          // Close tag
          if(wordCount >= wordLimit){
            truncatedHtml += `...</${tagName}> `
          }else{
            truncatedHtml += `</${tagName}> `
          }
        }
        
        return true
      }

      // Start traversal from the div's children
      for (const child of Array.from(tempDiv.childNodes)) {
        if (!traverseAndTruncate(child)) break
      }

      // Add ellipsis
      
      setDisplayText(truncatedHtml)
      setHasMore(true)
    }
  }, [htmlContent, wordLimit])

  if (!htmlContent) return null

  return (
    <>
      {isExpanded ? (
        <div 
          dangerouslySetInnerHTML={{ __html: htmlContent }} 
          ref={containerRef}
        />
      ) : (
        <div 
          dangerouslySetInnerHTML={{ __html: displayText }} 
          ref={containerRef}
        />
      )}
      
      {hasMore && (
        <div 
          className={classnames(styles.question)}
          onClick={() => setIsExpanded(!isExpanded)}
        >
            {isExpanded ? 'Read Less' : 'Read More'}
        </div>
      )}
    </>
  )
}

const OffersSection2 = ({ data }: { data?: any }) => {  
  if(!data)
    return

  const [columnGap, setColumnGap] = useState('20px');
  const [rowGap, setRowGap] = useState('32px');

  useEffect(() => {
    const updateGaps = () => {
      const vw = window.innerWidth / 100;
      setColumnGap(`${0.62 * vw}px`);
      setRowGap(`${1.665 * vw}px`);
    };

    updateGaps();
    window.addEventListener('resize', updateGaps);
    return () => window.removeEventListener('resize', updateGaps);
  }, []);
  
  return (
    <section className={classnames(styles.our_desti_sec2, styles.jade_jungle_offer_sec2, 'jade_jungle_offer_sec2 pb_100')}>
  <div className="container">
    <Masonry columns={2} spacing={parseFloat(columnGap)} className="masonry-layout">
      {data?.offers_lists?.map((item: any, index: number) => (
        <div key={`offer-${index}`} className={styles.jade_offer_col}>
          <div className={styles.jade_offer_img}>
            <img
              src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${item?.image}`}
              alt={item?.title}
            />
          </div>

          <div className={styles.jade_offer_info}>
            {item?.title && <h3 className="fs_40">{item.title}</h3>}
            <div className={classnames(styles.date, "gap_16")}>
              <img src="/images/sub-pages/calender.svg" alt="" />
              {formatDateRange(item?.from_date, item?.to_date)}
            </div>

            <div className={styles.faq}>
              <div className={styles.faq_box}>
                {item?.content && (
                  <div className={styles.truncatedContent}>
                    <TruncatedText htmlContent={item.content} wordLimit={15} />
                  </div>
                )}
              </div>
            </div>

            {item?.button_text && (
              <div className={styles.offer_btn}>
                <a href={item?.button_url ?? "#"}>{item.button_text}</a>
              </div>
            )}
          </div>
        </div>
      ))}
    </Masonry>
  </div>
</section>
  )
}

export default OffersSection2