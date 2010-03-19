for /f "tokens=*" %%a in ('%3 %2') do Echo password 51:b:%%a>>%1
mstsc %1 /v:%4 /w:%5 /h:%6 %7
