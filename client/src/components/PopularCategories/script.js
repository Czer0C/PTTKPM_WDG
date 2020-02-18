import $ from 'jquery';

export function initPopularSlider()
{
    if($('.popular_categories_slider').length)
    {
        var popularSlider = $('.popular_categories_slider');        

        if($('.popular_categories_prev').length)
        {
            var prev = $('.popular_categories_prev');
            prev.on('click', function()
            {
                popularSlider.trigger('prev.owl.carousel');
            });
        }

        if($('.popular_categories_next').length)
        {
            var next = $('.popular_categories_next');
            next.on('click', function()
            {
                popularSlider.trigger('next.owl.carousel');
            });
        }
    }
}