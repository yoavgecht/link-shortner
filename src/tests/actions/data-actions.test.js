import { getShortenUrlsHistoryList, getShortUrl, redirectToUrl, setShortLink, setShortenUrlsHistoryList, deleteLink } from '../../actions/data-actions';

test('should remove a shotren link from shorten links history list', () => {
    const action = deleteLink(`/api/delete-history-link/Ti27`);
    expect(action).toEqual({
        type: 'DELETE_LINK'
    })
});