import React, { Component } from 'react';

class CharacteristicsComponent extends Component {
    render() {
        return (
            <div className="characteristics">
                <div className="container">
                    <div className="row">

                        {/* Char. Item */}
                        <div className="col-lg-3 col-md-6 char_col">
                            
                            <div className="char_item d-flex flex-row align-items-center justify-content-start">
                                <div className="char_icon"><img src="images/char_1.png" alt=""/></div>
                                <div className="char_content">
                                    <div className="char_title">Giao hàng miễn phí</div>
                                    <div className="char_subtitle">Từ 150000VND</div>
                                </div>
                            </div>
                        </div>

                        {/* Char. Item */}
                        <div className="col-lg-3 col-md-6 char_col">
                            
                            <div className="char_item d-flex flex-row align-items-center justify-content-start">
                                <div className="char_icon"><img src="images/char_2.png" alt=""/></div>
                                <div className="char_content">
                                    <div className="char_title">Chính sách trả hàng</div>
                                    <div className="char_subtitle">Trong vòng 1 tuần</div>
                                </div>
                            </div>
                        </div>

                        {/* Char. Item */}
                        <div className="col-lg-3 col-md-6 char_col">
                            
                            <div className="char_item d-flex flex-row align-items-center justify-content-start">
                                <div className="char_icon"><img src="images/char_4.png" alt=""/></div>
                                <div className="char_content">
                                    <div className="char_title">Đấu giá an toàn</div>
                                    <div className="char_subtitle">Nói không với hàng giả</div>
                                </div>
                            </div>
                        </div>

                        {/* Char. Item */}
                        <div className="col-lg-3 col-md-6 char_col">
                            
                            <div className="char_item d-flex flex-row align-items-center justify-content-start">
                                <div className="char_icon"><img src="images/char_3.png" alt=""/></div>
                                <div className="char_content">
                                    <div className="char_title">Tùy chọn thanh toán</div>
                                    <div className="char_subtitle">Thỏa sức mua hàng</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CharacteristicsComponent;