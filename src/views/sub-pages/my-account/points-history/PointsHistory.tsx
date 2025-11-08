"use client";

import React, { useState, useMemo } from 'react';
import classnames from 'classnames';
import styles from './../styles.module.css';

const PointsHistory = ({ data = [], actionlist = [] }: { data?: any[]; actionlist?: any[] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const maxVisiblePages = 5;

  // Pagination logic
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return data.slice(startIndex, startIndex + rowsPerPage);
  }, [data, currentPage]);

  const formatDate = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const pad = (n: number) => (n < 10 ? '0' + n : n);
    return `${pad(date.getMonth() + 1)}/${pad(date.getDate())}/${String(date.getFullYear()).slice(2)} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  // Determine visible page numbers
  const getVisiblePages = () => {
    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(currentPage - half, 1);
    let end = start + maxVisiblePages - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(end - maxVisiblePages + 1, 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const renderListItem = (h_row: any, index: number) => {
    const { action_id, created_at, points_earned, _id } = h_row;
    const rowNumber = (currentPage - 1) * rowsPerPage + index + 1;

    return (
      <tr key={_id}>
        <td style={{ border: '1px solid #ccc', padding: '8px' }} align="center">{rowNumber}</td>
        <td style={{ border: '1px solid #ccc', padding: '8px' }}>{actionlist[action_id]}</td>
        <td style={{ border: '1px solid #ccc', padding: '8px' }} align="center">{points_earned}</td>
        <td style={{ border: '1px solid #ccc', padding: '8px' }}>{formatDate(created_at)}</td>
      </tr>
    );
  };

  return (
    <div className={classnames(styles.likes_share_page)}>
      <div className={classnames(styles.dashboard_container)}>
        <div className={classnames(styles.likes_content)}>
          {data.length === 0 ? (
            <div className={classnames(styles.no_likes)}>
              <h3>No data found</h3>
              <p>You haven't earned any points yet. Start exploring!</p>
            </div>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table
                  width="100%"
                  style={{
                    borderCollapse: 'collapse',
                    border: '1px solid #ccc',
                  }}
                >
                  <thead>
                    <tr style={{ background: '#f7f7f7' }}>
                      <th style={{ border: '1px solid #ccc', padding: '8px' }} align="center">#</th>
                      <th style={{ border: '1px solid #ccc', padding: '8px' }}>Action</th>
                      <th style={{ border: '1px solid #ccc', padding: '8px' }} align="center">Points</th>
                      <th style={{ border: '1px solid #ccc', padding: '8px' }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((h_row, index) => renderListItem(h_row, index))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    style={{
                      margin: '0 5px',
                      padding: '6px 10px',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Prev
                  </button>

                  {getVisiblePages().map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      style={{
                        margin: '0 3px',
                        padding: '6px 10px',
                        backgroundColor: currentPage === page ? '#1976d2' : '#f1f1f1',
                        color: currentPage === page ? '#fff' : '#000',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    style={{
                      margin: '0 5px',
                      padding: '6px 10px',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PointsHistory;
