'use client'

// React Imports
import { useState } from 'react'
import type { SyntheticEvent, ReactElement } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'

// Component Imports
import CustomTabList from '@core/components/mui/TabList'

export default function Blog() {
  return (
    <>
      <div className="home_banner merch_banner">
        <div className="banner_bg_image">
            <div className="banner_bg_image_hero">
                <img src="/images/front-pages/images/advanture.jpg" />
            </div>
        </div>
      </div>
      <section className="ambassadorship_sec1 blog-section py_100">
          <div className="container">
              <div className="head_text_center">
                  <h3 className="fs_35">Adventure Is Calling — Are You Ready?</h3>
              </div>
              <div className="grid3 gap_40">
                  <div className="grid_box">
                      <div className="blog-box">
                          <div className="shop_merch">
                              <a className="fl_bx_lnk_glb-" href="moab-article.html"></a>
                              <div className="shop_merch_img">
                                  <img className="bx_sd" src="/images/front-pages/images/network2.jpg" />
                              </div>
                              <div className="merch_info">
                                  <h4>Dominican Republic untamed</h4>
                                  <div className="btn">
                                      <a href="moab-article.html">Read More</a>                                        </div>
                              </div>
                        </div>
                      </div>
                  </div>
                  <div className="grid_box">
                      <div className="blog-box">
                          <div className="shop_merch">
                              <a className="fl_bx_lnk_glb-" href="moab-article.html"></a>
                              <div className="shop_merch_img">
                                  <img className="bx_sd" src="/images/front-pages/images/network2.jpg" />
                              </div>
                              <div className="merch_info">
                                  <h4>Dominican Republic untamed</h4>
                                  <div className="btn">
                                      <a href="moab-article.html">Read More</a>                                        </div>
                              </div>
                        </div>
                      </div>
                  </div>
                  <div className="grid_box">
                      <div className="blog-box">
                          <div className="shop_merch">
                              <a className="fl_bx_lnk_glb-" href="moab-article.html"></a>
                              <div className="shop_merch_img">
                                  <img className="bx_sd" src="/images/front-pages/images/network2.jpg" />
                              </div>
                              <div className="merch_info">
                                  <h4>Dominican Republic untamed</h4>
                                  <div className="btn">
                                      <a href="moab-article.html">Read More</a>                                        </div>
                              </div>
                        </div>
                      </div>
                  </div>
                  <div className="grid_box">
                      <div className="blog-box">
                          <div className="shop_merch">
                              <a className="fl_bx_lnk_glb-" href="moab-article.html"></a>
                              <div className="shop_merch_img">
                                  <img className="bx_sd" src="/images/front-pages/images/network2.jpg" />
                              </div>
                              <div className="merch_info">
                                  <h4>Dominican Republic untamed</h4>
                                  <div className="btn">
                                      <a href="moab-article.html">Read More</a>                                        </div>
                              </div>
                        </div>
                      </div>
                  </div>
                  <div className="grid_box">
                      <div className="blog-box">
                          <div className="shop_merch">
                              <a className="fl_bx_lnk_glb-" href="moab-article.html"></a>
                              <div className="shop_merch_img">
                                  <img className="bx_sd" src="/images/front-pages/images/network2.jpg" />
                              </div>
                              <div className="merch_info">
                                  <h4>Dominican Republic untamed</h4>
                                  <div className="btn">
                                      <a href="moab-article.html">Read More</a>                                        </div>
                              </div>
                        </div>
                      </div>
                  </div>
                  <div className="grid_box">
                      <div className="blog-box">
                          <div className="shop_merch">
                              <a className="fl_bx_lnk_glb-" href="moab-article.html"></a>
                              <div className="shop_merch_img">
                                  <img className="bx_sd" src="/images/front-pages/images/network2.jpg" />
                              </div>
                              <div className="merch_info">
                                  <h4>Dominican Republic untamed</h4>
                                  <div className="btn">
                                      <a href="moab-article.html">Read More</a>                                        </div>
                              </div>
                        </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>
    </>
  )
}