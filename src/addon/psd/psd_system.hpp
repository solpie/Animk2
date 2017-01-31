#define LITTLE2BIG_SHORT(dst16, src16)             \
    *(((unsigned char *)&dst16) + 0) = src16 >> 8; \
    *(((unsigned char *)&dst16) + 1) = src16
#define LITTLE2BIG_INT(dst32, src32)                \
    *(((unsigned char *)&dst32) + 0) = src32 >> 24; \
    *(((unsigned char *)&dst32) + 1) = src32 >> 16; \
    *(((unsigned char *)&dst32) + 2) = src32 >> 8;  \
    *(((unsigned char *)&dst32) + 3) = src32

typedef char psd_char;
typedef unsigned char psd_uchar;
typedef unsigned short psd_ushort;

void *psd_malloc(int size)
{
    void *pMalloc = malloc(size);
    memset(pMalloc, 0, size);
    return pMalloc;
}

int psd_fwrite(psd_uchar *buffer, int count, void *file)
{
    return fwrite(buffer, 1, count, (FILE *)file);
}

void psd_fclose(void *file)
{
    fclose((FILE *)file);
}