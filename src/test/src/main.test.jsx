import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../../redux/store'
import App from '../../pages/App'

describe('App root render', () => {
  it('debe renderizar App dentro de Provider sin fallos', () => {
    const { getByText } = render(
      <Provider store={store}>
        <App />
      </Provider>
    )

    expect(getByText(/Market Products/i)).toBeTruthy()
  })
})
