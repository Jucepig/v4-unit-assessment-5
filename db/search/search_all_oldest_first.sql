SELECT 
hp.id AS post_id, 
title, 
content, 
img, 
profile_pic, 
date_created, 
username AS author_username
FROM helo_posts AS hp
JOIN helo_users AS hu ON hp.author_id = hu.id
WHERE LOWER(title) LIKE $1
ORDER BY date_created ASC;