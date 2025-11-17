'use client'

// Component Imports
import ImageWithText from './ImageWithText'
import LargeImageWithText from './LargeImageWithText'
import SubscribeShare from './SubscribeShare'

const EditSectionWrapper = ({ section, data }: { section?: string; data?: [] }) => {
	
  	return (
	    <>
	      {section=="image_with_text" ? <ImageWithText section={data} /> : null}
	      {/*{section=="image_with_text" ? <HomeSection1 /> : null}
	      {section=="image_with_text" ? <HomeSection2 /> : null}
	      {section=="image_with_text" ? <HomeSection3 /> : null}*/}
	      {section=="large_image_with_content" ? <LargeImageWithText section={data}/> : null}
	      {/*{section=="image_with_text" ? <HomeSection5 sectionProps={instagramSliderSectionProps} /> : null}
	      {section=="image_with_text" ? <HomeSection6 /> : null}*/}
	      {section=="subscribe_share" ? <SubscribeShare section={data} /> : null}
	    </>
  	)
}

export default EditSectionWrapper
