Trying out lots of different things.

National tests using this URL: http://localhost:9000/national.html#c/benefits/p_of_parents_satisfied_child_program_2014

Detail tests using this URL:
http://localhost:9000/detail.html#s/WI/demand/p_of_children_in_programs_2014

## Findings
* Header and footer are uglying and useless (?)
* background-colors gone
* FF right side cutoff
* navbar gone (did we do that?)
* png are blurry (max width? or get rid of them?)
* Safari Export to PDF does better job with spacing to the page
* Otherwise, text sizing is various
* No good page breaks
* FF Adding 69 empty pages to end of Detail, 1 blank page to end of Ntnl.
* IE11 cuts off url hash 
* IE10-11 SVG alignment off in print (but also in real life)

## Plan
I need to fix all the above problems, or work around them.

* Hide header and footer (how did we hide nav bar?)
* Don't want to rely on background colors - IA should be better than that
* Need consistent width
* Consistent typeface not important
* switch PNG's to SVG's - scaling is important in web -> print
* Figure out FF width problems.
* Try it out on IE
* Figure out consistent page break solution
* Figure out blank page problem in FF
* Need some way to make titles of cards stand out without background color