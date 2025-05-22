import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav>
            <Link to="/">Trang chủ</Link>
            {/* Đã xóa phần auth links */}
        </nav>
    );
}