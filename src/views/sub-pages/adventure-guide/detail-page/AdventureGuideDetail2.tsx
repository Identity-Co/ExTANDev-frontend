// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const BlogDetailSection2 = ({ data }: { data?: []; }) => {
  return (
    <div className={classnames(styles.stories_details_sec2, styles.moab_sec2, 'pb_150')}>

        {data.fields.map((content: any, index: number) => (
            content.type === "image" ? (
                <div className="container" key={index}>
                  <div className={classnames(styles.stories_details_image)}>
                    <div className="full_img">
                      <img src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${content.value}`} alt={content.caption || 'image'} />
                    </div>
                    {content.caption && content.caption !== "" && (
                      <span className={classnames(styles.img_alt)}>
                        {content.caption}
                      </span>
                    )}
                  </div>
                </div>
            ) : (
                <div className={classnames(styles.container_smll)} key={index}>
                  <div
                    className={classnames(styles.stories_details_text)}
                    dangerouslySetInnerHTML={{
                      __html: (content?.value || '').replace(/<h3>/g, '<h3 class="fs_35 py_24">'),
                    }}
                  />
                </div>
            )
        ))}
    </div>
  )
}

export default BlogDetailSection2
