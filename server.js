const setUp = async() => {
    try {
        await db.syncAndSeed();
        const port = process.env.PORT || 3000;
        app.listen(port, () => console.log(`listening on port ${port}`));
    } catch (ex) {
        console.log(ex);
    }
};

setUp();